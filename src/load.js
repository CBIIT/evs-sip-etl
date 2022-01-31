import neo4j from 'neo4j-driver';

const load = async () => {
  const uri = process.env.NEO4J_URI;
  const user = process.env.NEO4J_USER;
  const pass = process.env.NEO4J_PASS;
  const driver = neo4j.driver(uri,neo4j.auth.basic(user, pass));
  const session = driver.session();

  try {
    const result = await session.run(
      `CREATE (a:message {text: $text}) RETURN a`,
      {text: 'Hello, world!'}
    );

    const singleRecord = result.records[0];
    const node = singleRecord.get(0);

    console.log(node.properties.text);
    const deletion = await session.run(
      'MATCH (n) DELETE n'
    );
  } finally {
    await session.close();
  }

  await driver.close();
};

export default load;