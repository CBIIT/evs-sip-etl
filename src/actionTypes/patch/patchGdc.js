import fs from 'fs';
import neo4j from 'neo4j-driver';

const inputDir = process.env.DATA_DIR_GDC ?? 'data/gdc';

const neo4jUri = process.env.NEO4J_URI ?? 'bolt://localhost:7687';
const neo4jUser = process.env.NEO4J_USER;
const neo4jPass = process.env.NEO4J_PASS;
const driver = neo4j.driver(neo4jUri, neo4j.auth.basic(neo4jUser, neo4jPass));
const session = driver.session();

/**
 * Patches the GDC Neo4j data from additional source data files
 * @returns {void}
 */
const patchGdc = async () => {
  let props = JSON.parse(fs.readFileSync(`${inputDir}/gdc_props.js`));
  props = await unflatten(props);
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
