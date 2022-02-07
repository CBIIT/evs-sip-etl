import neo4j, { session } from 'neo4j-driver';

/**
 * Creates Neo4j nodes
 * 
 * @param {Object} transformedData Neo4j nodes to create
 * 
 * @returns {Array} Bookmarks of transactions
 */
const load = (transformedData) => {
  // Data
  const node = transformedData.node;
  const relationships = transformedData.relationships;

  // Neo4j connection
  const uri = process.env.NEO4J_URI;
  const user = process.env.NEO4J_USER;
  const pass = process.env.NEO4J_PASS;
  const driver = neo4j.driver(uri, neo4j.auth.basic(user, pass));

  // Synchronize transactions
  const savedBookmarks = [];

  // Create the Node.
  const nodeSession = driver.session(neo4j.WRITE);
  nodeSession.writeTransaction(tx => loadNode(tx, node)).then(
    () => {
      savedBookmarks.push(nodeSession.lastBookmark());

      return nodeSession.close();
    }
  );

  // Create the Relationships.
  const relationshipBookmarks = loadRelationships(driver, relationships);
  savedBookmarks.push(...relationshipBookmarks);
};

/**
 * Loads the Node
 * 
 * @param {Object} tx The transaction
 * @param {Object} node The node to add
 */
const loadNode = (tx, node) => {
  return tx.run(
    `CREATE (n:node {
      handle: '${node.handle}',
      model: '${node.model}',
      nanoid: '${node.nanoid}'
    })`
  );
};

/**
 * Loads Relationships
 * 
 * @param {Object} driver The Neo4j driver
 * @param {Array} relationships The relationships to add
 * 
 * @returns {Array} The transaction bookmarks
 */
const loadRelationships = (driver, relationships) => {
  const relationshipBookmarks = [];
  const relationshipPromises = [];

  relationships.forEach((relationship) => {
    // Wait for previous relationship bookmarks to resolve
    const relationshipSession = driver.session(neo4j.WRITE);

    // Wait for previous relationship transaction promises to resolve
    Promise.all(relationshipPromises).then(() => {
      const relationshipPromise = loadRelationship(relationshipSession, relationship);
      relationshipPromises.push(relationshipPromise);
      return relationshipPromise;
    }).then(() => {
      relationshipBookmarks.push(relationshipSession.lastBookmark());

      relationshipSession.close();
    });
  });

  return relationshipBookmarks;
};

/**
 * Loads a single Relationship
 *
 * @param {Object} tx The transaction
 * @param {Relationship} relationship The relationship to add
 */
const loadRelationship = async (session, relationship) => {
  return await session.run(`
    MERGE (r:relationship {
      handle: '${relationship.handle}',
      is_required: ${relationship.is_required},
      model: '${relationship.model}',
      multiplicity: '${relationship.multiplicity}'
    })
    ON CREATE
        SET r.nanoid = '${relationship.nanoid}'
    RETURN r;
  `);
};

/**
 * Makes Neo4j edges
 * 
 * @param {Object} edges Edges to make
 */
export const makeAllEdges = async (edges) => {
  // Neo4j connection
  const uri = process.env.NEO4J_URI;
  const user = process.env.NEO4J_USER;
  const pass = process.env.NEO4J_PASS;
  const driver = neo4j.driver(uri,neo4j.auth.basic(user, pass));

  makeRelationshipEdges(edges.fromRelationships, driver).then(() => {
    // stub
    return true;
  }).then(() => {
    driver.close();
  });
};

/**
 * Makes edges from Relationship nodes
 * 
 * @param {Object} driver Neo4j driver
 */
const makeRelationshipEdges = async (edges, driver) => {
  for (const edge of edges) {
    console.log(edge);
    const session = driver.session();
    session.run(`
      MATCH
        (r:relationship),
        (n:node)
      WHERE r.handle = '${edge.from}' AND n.handle = '${edge.to}'
      CREATE (r)-[e:RELTYPE {name: '${edge.name}'}]->(n)
    `).then(() => {
      session.close();
    });
  }
};

export default load;