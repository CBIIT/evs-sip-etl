import fs from 'fs';
import neo4j from 'neo4j-driver';

const inputDir = process.env.DATA_DIR_GDC ?? 'data/gdc';

const neo4jUri = process.env.NEO4J_URI;
const neo4jUser = process.env.NEO4J_USER;
const neo4jPass = process.env.NEO4J_PASS;
const driver = neo4j.driver(neo4jUri, neo4j.auth.basic(neo4jUser, neo4jPass));

/**
 * Patches the GDC Neo4j data from additional source data files
 * @returns {void}
 */
const patchGdc = async () => {
  let ncitCodes = JSON.parse(fs.readFileSync(`${inputDir}/gdc_props.js`));
  ncitCodes = await unflatten(ncitCodes);

  console.log('Patching NCIt codes...');

  for (const categoryName in ncitCodes) {
    for (const nodeName in ncitCodes[categoryName]) {
      for (const propertyName in ncitCodes[categoryName][nodeName]) {
        const ncitCode = ncitCodes[categoryName][nodeName][propertyName];
        const session = driver.session();

        try {
          console.log(`Assigning NCIt code ${ncitCode} to property ${nodeName}.${propertyName}...`);

          const result = await session.run(
            'MATCH (p:property) MATCH (p)<--(n:node) WHERE n.handle=$nodeName AND p.handle=$propertyName SET p.ncit_code=$ncitCode RETURN p.handle, p.ncit_code, n.handle;',
            {
              ncitCode: ncitCode,
              nodeName: nodeName,
              propertyName: propertyName,
            }
          );
          const record = result.records[0];

          console.log(`Assigned NCIt code ${record.get('p.ncit_code')} to property ${record.get('n.handle')}.${record.get('p.handle')}`);
        } finally {
          await session.close()
        }
      }
    }
  }

  console.log('Finished patching NCIt codes');

  // on application exit:
  await driver.close()

  return;
};

/**
 * Transforms JSON from { A.B.C: D } to {
 *   A: {
 *     B: {
 *       C: D
 *     }
 *   }
 * }
 * @param {object} flatJson The flatly-structured JSON
 * @returns {object} The nested-structured JSON
 */
const unflatten = async (flatJson) => {
  const nestedJson = {};

  Object.keys(flatJson).forEach((unsplitKey) => {
    const keys = unsplitKey.split('.'); // Separate A.B.C into A, B, C
    const val = flatJson[unsplitKey];

    // Reset traverser to the top level map
    let tempMap = nestedJson;

    // Build the map's keys
    keys.forEach((key, i) => {
      // Initialize new keys with an empty map or array
      if (!tempMap.hasOwnProperty(key)) {
        // Last element should be an array
        if (i === keys.length - 1) {
          tempMap[key] = val;
        } else {
          tempMap[key] = {};
        }
      }

      tempMap = tempMap[key];
    });
  });

  return nestedJson;
};

export default patchGdc;
