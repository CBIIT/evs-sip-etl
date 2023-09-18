import fs from 'fs';
import neo4j from 'neo4j-driver';

const inputDir = process.env.DATA_DIR_CTDC ?? 'data/ctdc';

const neo4jUri = process.env.NEO4J_URI;
const neo4jUser = process.env.NEO4J_USER;
const neo4jPass = process.env.NEO4J_PASS;
const driver = neo4j.driver(neo4jUri, neo4j.auth.basic(neo4jUser, neo4jPass));

/**
 * Patches the CTDC Neo4j data from additional source data files
 * @returns {void}
 */
const patchCtdc = async () => {
  let nodes = JSON.parse(fs.readFileSync(`${inputDir}/CTDC_Mappings.json`));

  console.log('Patching NCIt codes...');

  for (const nodeName in nodes) {
    const node = nodes[nodeName];
    const nodeNcitCode = node.n_n_code;
    const nodeSession = driver.session();
    const properties = node.properties;

    try {
      console.log(`Assigning NCIt code ${nodeNcitCode} to node "${nodeName}"...`);

      const result = await nodeSession.run(
        'MATCH (n:node) WHERE n.handle=$nodeName AND n.model=$model SET n.ncit_code=$ncitCode RETURN n.handle, n.ncitCode;',
        {
          model: 'CTDC',
          ncitCode: nodeNcitCode,
          nodeName: nodeName,
        }
      );
      const record = result.records[0];

      console.log(`Assigned NCIt code ${record.get('n.ncit_code')} to node ${record.get('n.handle')}`);
    } finally {
      await nodeSession.close()
    }

    for (const property of properties) {
      const propertyName = property.p_name;
      const propertyNcitCode = property.p_n_code;
      const propertySession = driver.session();

      try {
        console.log(`Assigning NCIt code ${propertyNcitCode} to property ${nodeName}.${propertyName}...`);

        const result = await propertySession.run(
          'MATCH (p:property) MATCH (p)<--(n:node) WHERE n.handle=$nodeName AND p.handle=$propertyName AND n.model=$model SET p.ncit_code=$ncitCode RETURN p.handle, p.ncitCode, n.handle;',
          {
            model: 'CTDC',
            ncitCode: propertyNcitCode,
            nodeName: nodeName,
            propertyName: propertyName,
          }
        );
        const record = result.records[0];

        console.log(`Assigned NCIt code ${record.get('p.ncit_code')} to property ${record.get('n.handle')}.${record.get('p.handle')}`);
      } finally {
        await propertySession.close()
      }
    }
  }

  console.log('Finished patching NCIt codes');

  // on application exit:
  await driver.close()

  return;
};

export default patchCtdc;
