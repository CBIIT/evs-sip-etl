import neo4j, { session } from 'neo4j-driver';

/**
 * Creates Neo4j nodes
 * 
 * @param {Object} transformedData Neo4j nodes to create
 * 
 * @returns {Array} Bookmarks of transactions
 */
const load = async (transformedData) => {
  // Data
  const node = transformedData.node;
  const relationships = transformedData.relationships;

  // Neo4j connection
  const uri = process.env.NEO4J_URI;
  const user = process.env.NEO4J_USER;
  const pass = process.env.NEO4J_PASS;
  const driver = neo4j.driver(uri, neo4j.auth.basic(user, pass));

  // Synchronize queries
  const queryPromises = [];

  // Create the Node.
  const nodeSession = driver.session(neo4j.WRITE);
  const nodeResults = loadNode(nodeSession, node);
  queryPromises.push(nodeResults);

  // Create the Relationships.
  const relationshipsResults = loadRelationships(driver, relationships);
  queryPromises.push(relationshipsResults);

  return Promise.all(queryPromises).then(async () => {
    await driver.close();
  });
};

/**
 * Loads the Node
 * 
 * @param {Object} session The session
 * @param {Object} node The node to add
 * 
 * @returns {Array} The resulting records
 */
const loadNode = async (session, node) => {
  const records = [];

  try {
    const results = await session.run(
      `CREATE (n:node {
        handle: '${node.handle}',
        model: '${node.model}',
        nanoid: '${node.nanoid}'
      })`
    );

    records.push(...results.records);
  } catch (err) {
    console.log(err);
  } finally {
    await session.close();
  }

  return records;
};

/**
 * Loads Relationships
 * 
 * @param {Object} driver The Neo4j driver
 * @param {Array} relationships The relationships to add
 * 
 * @returns {Array} The resulting records
 */
const loadRelationships = (driver, relationships) => {
  const records = [];

  relationships.forEach((relationship) => {
    // Wait for previous relationship bookmarks to resolve
    const relationshipSession = driver.session(neo4j.WRITE);

    // Wait for previous relationship transaction promises to resolve
    try {
      const relationshipRecords = loadRelationship(relationshipSession, relationship);
      records.push(relationshipRecords);
    } catch (err) {
      console.log(err);
    }
  });

  return records;
};

/**
 * Loads a single Relationship
 *
 * @param {Object} session The session
 * @param {Relationship} relationship The relationship to add
 * 
 * @returns {Array} The resulting records
 */
const loadRelationship = async (session, relationship) => {
  const records = [];

  try {
    const results = await session.run(`
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

    records.push(...results.records);
  } catch (err) {
    console.log(err);
  } finally {
    await session.close();
  }

  return records;
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

  makeRelationshipEdges(driver, edges.fromRelationships);

  await driver.close();
};

/**
 * Makes edges from Relationship nodes
 * 
 * @param {Object} driver Neo4j driver
 * @param {Array} edges Relationship edges
 * 
 * @returns {Array} The resulting records
 */
const makeRelationshipEdges = (driver, edges) => {
  const records = [];

  edges.forEach((edge) => {
    // Wait for previous relationship bookmarks to resolve
    const edgeSession = driver.session(neo4j.WRITE);

    // Wait for previous relationship transaction promises to resolve
    try {
      const edgeRecords = makeRelationshipEdge(edgeSession, edge);
      records.push(edgeRecords);
    } catch (err) {
      console.log(err);
    }
  });

  return records;
};

/**
 * Loads a single Edge
 *
 * @param {Object} session The session
 * @param {Object} edge The edge to add
 * 
 * @returns {Array} The resulting records
 */
const makeRelationshipEdge = async (session, edge) => {
  const records = [];

  try {
    const results = await session.run(`
      MATCH
        (r:relationship),
        (n:node)
      WHERE r.handle = '${edge.from}' AND n.handle = '${edge.to}'
      CREATE (r)-[e:RELTYPE {name: '${edge.name}'}]->(n)
    `);

    records.push(...results.records);
  } catch (err) {
    console.log(err);
  } finally {
    await session.close();
  }

  return records;
};

export default load;