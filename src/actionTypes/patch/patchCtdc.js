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
    const properties = node.properties;

    await patchNode(nodeNcitCode, nodeName);

    for (const property of properties) {
      const propertyName = property.p_name;
      const propertyNcitCode = property.p_n_code;
      const values = property.values;

      await patchProperty(propertyNcitCode, nodeName, propertyName);

      for (const value of values) {
        const valueName = value.v_name;
        const valueNcitCode = value.v_n_code;

        await patchValue(valueNcitCode, nodeName, propertyName, valueName);
      }
    }
  }

  console.log('Finished patching NCIt codes');

  // on application exit:
  await driver.close();

  return;
};

/**
 * @param {string} ncitCode The node's NCIt code
 * @param {string} nodeName The node's name
 */
const patchNode = async (ncitCode, nodeName) => {
  const session = driver.session();

  try {
    console.log(`Assigning NCIt code ${ncitCode} to node "${nodeName}"...`);

    const result = await session.run(
      `
        MATCH (n:node)
        WHERE n.handle=$nodeName
          AND n.model=$model
        SET n.ncit_code=$ncitCode
        RETURN n.handle, n.ncit_code;
      `,
      {
        model: 'CTDC',
        ncitCode: ncitCode,
        nodeName: nodeName,
      }
    );
    const record = result.records[0];

    console.log(`Assigned NCIt code ${record.get('n.ncit_code')} to node ${record.get('n.handle')}`);
  } finally {
    await session.close();
  }
};

/**
 * @param {string} ncitCode The property's NCIt code
 * @param {string} nodeName The node's name
 * @param {string} propertyName The property's name
 */
const patchProperty = async (ncitCode, nodeName, propertyName) => {
  const session = driver.session();

  try {
    console.log(`Assigning NCIt code ${ncitCode} to property ${nodeName}.${propertyName}...`);

    const result = await session.run(
      `
        MATCH (p:property)
          MATCH (p)<--(n:node)
        WHERE n.handle=$nodeName
          AND p.handle=$propertyName
          AND n.model=$model
        SET p.ncit_code=$ncitCode
        RETURN p.handle, p.ncit_code, n.handle;
      `,
      {
        model: 'CTDC',
        ncitCode: ncitCode,
        nodeName: nodeName,
        propertyName: propertyName,
      }
    );
    const record = result.records[0];

    console.log(`Assigned NCIt code ${record.get('p.ncit_code')} to property ${record.get('n.handle')}.${record.get('p.handle')}`);
  } finally {
    await session.close();
  }
};

/**
 * @param {string} ncitCode The value's NCIt code
 * @param {string} nodeName The node's name
 * @param {string} propertyName The property's name
 * @param {stirng} valueName The value's name
 */
const patchValue = async (ncitCode, nodeName, propertyName, valueName) => {
  const session = driver.session();

  try {
    console.log(`Assigning NCIt code ${ncitCode} to value ${nodeName}.${propertyName}.${valueName}...`);

    const result = await session.run(
      `
        MATCH (p:property)
          MATCH (p)<--(n:node)
          MATCH (vs:value_set)<--(p)
          MATCH (v:term)<--(vs)
        WHERE n.model=$model
          AND n.handle=$nodeName
          AND p.handle=$propertyName
          AND v.value=$valueName
        SET v.ncit_code=$ncitCode
        RETURN v.ncit_code, n.handle, p.handle, v.value;
      `,
      {
        model: 'CTDC',
        ncitCode: ncitCode,
        nodeName: nodeName,
        propertyName: propertyName,
        valueName: valueName,
      }
    );
    const record = result.records[0];

    console.log(`Assigned NCIt code ${record.get('v.ncit_code')} to value ${record.get('n.handle')}.${record.get('p.handle')}.${record.get('v.value')}`);
  } finally {
    await session.close();
  }
};

export default patchCtdc;
