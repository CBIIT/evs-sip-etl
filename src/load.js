import neo4j from 'neo4j-driver';

const load = async (transformedData) => {
  // Data
  const node = transformedData.node;
  const relationships = transformedData.relationships;

  // Neo4j connection
  const uri = process.env.NEO4J_URI;
  const user = process.env.NEO4J_USER;
  const pass = process.env.NEO4J_PASS;
  const driver = neo4j.driver(uri,neo4j.auth.basic(user, pass));

  // Clear, for testing purposes
  loadNode(node, driver).then(() => {
    loadRelationships(relationships, driver);
  }).then(() => {
    driver.close();
  });
};

/**
 * Loads the Node
 */
const loadNode = async (node, driver) => {
  const session = driver.session();
  session.run(
    `CREATE (n:node {
      handle: '${node.handle}',
      model: '${node.model}',
      nanoid: '${node.nanoid}'
    })`
  ).then(() => {
    session.close();
  });
};

/**
 * Loads Relationships
 */
const loadRelationships = async (relationships, driver) => {
  relationships.forEach(async (relationship) => {
    const session = driver.session();

    // Create Relationship node
    session.run(
      `CREATE (r:relationship {
        handle: '${relationship.handle}',
        is_required: '${relationship.is_required}',
        model: '${relationship.model}',
        multiplicity: '${relationship.multiplicity}',
        nanoid: '${relationship.nanoid}'
      })`
    ).then(() => {
    /*
      session.run(`
        MATCH
          (r:relationship),
          (n:node)
        WHERE r.handle = '${relationship.handle}' AND n.handle = '${relationship.src}'
        CREATE (r)-[e:RELTYPE {name: 'has_src'}]->(n)
      `);
    }).then(() => {
      session.run(`
        MATCH
          (r:relationship),
          (n:node)
        WHERE r.handle = '${relationship.handle}' AND n.handle = '${relationship.dst}'
        CREATE (r)-[e:RELTYPE {name: 'has_dst'}]->(n)
      `);
    }).then(() => {
    */
      session.close();
    });
  });
};

export default load;