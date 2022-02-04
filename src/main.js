import { readdirSync } from 'fs';
import path from 'path';
import extract from './extract.js';
import neo4j from 'neo4j-driver';
import transform from './transform.js';
import load from './load.js';

const main = () => {
  const filePaths = filesGenerator();

  if (process.env.IS_DEV) {
    clearDatabase().then(() => {
      etl(filePaths);
    });
  } else {
    etl(filePaths);
  }
};

/**
 * Performs data extraction, transformation, and loading
 * 
 * @param {Array} filePaths Full paths of files to extract
 */
const etl = (filePaths) => {
  // Go through each file
  for (const filePath of filePaths) {
    const parsedFile = extract(filePath);
    const transformedData = transform(parsedFile);
    load(transformedData);
  }
}

/**
 * Clears the database for testing purposes
 */
const clearDatabase = async () => {
  // Neo4j connection
  const uri = process.env.NEO4J_URI;
  const user = process.env.NEO4J_USER;
  const pass = process.env.NEO4J_PASS;
  const driver = neo4j.driver(uri,neo4j.auth.basic(user, pass));
  const session = driver.session();

  session.run(
    'MATCH (n) DETACH DELETE n'
  ).then(() => {
    session.close();
  }).then(() => {
    driver.close();
  });
};

/**
 * Yields names of files in the data directory
 */
const filesGenerator = function* () {
  const dataDir = process.env.DATA_DIR;

  try {
    const filenames = readdirSync(dataDir);

    for (const filename of filenames) {
      // Skip definition files
      if (filename[0] == '_') {
        continue;
      }

      // Skip non-YAML files
      if (filename.split('.').at(-1).toLowerCase() !== 'yaml') {
        continue;
      }

      yield `${dataDir}${path.sep}${filename}`;
    }
  } catch (err) {
    console.log(err);
  }
};

export default main;