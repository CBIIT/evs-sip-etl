import neo4j from 'neo4j-driver';

const load = async (transformedData) => {
  // Data
  const node = transformedData.node;

  // Neo4j connection
  const uri = process.env.NEO4J_URI;
  const user = process.env.NEO4J_USER;
  const pass = process.env.NEO4J_PASS;
  const driver = neo4j.driver(uri,neo4j.auth.basic(user, pass));
  const session = driver.session();

  try {
    // Clear, for testing purposes
    await session.run(
      'MATCH (n) DELETE n'
    );

    // Create Node
    await session.run(
      `CREATE (n:node {
        handle: '${node.handle}',
        model: '${node.model}',
        nanoid: '${node.nanoid}'
      })`
    );
  } finally {
    await session.close();
  }

  await driver.close();
};

export default load;