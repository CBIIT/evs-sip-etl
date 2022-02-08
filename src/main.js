import { readdirSync } from 'fs';
import path from 'path';
import extract from './extract.js';
import neo4j from 'neo4j-driver';
import transform from './transform.js';
import load, { makeAllEdges } from './load.js';

const main = () => {
  const preparationPromises = [];
  const filePaths = filesGenerator();

  if (process.env.IS_DEV) {
    const clearDatabasePromise = clearDatabase();
    preparationPromises.push(clearDatabasePromise);
  }

  return Promise.all(preparationPromises).then(() => {
    return etl(filePaths).then(edges => {
      // stub
    });
  });
};

/**
 * Performs data extraction, transformation, and loading
 * 
 * @param {Array} filePaths Full paths of files to extract
 * 
 * @returns {Object} Edges to make later
 */
const etl = async (filePaths) => {
  let edges = {
    fromRelationships: [/*
      {
        name: 'has_src',
        src: 'someRelationshipName',
        dst: 'someNodeName',
      }
    */]
  };

  // Go through each file
  for (const filePath of filePaths) {
    const parsedFile = extract(filePath);
    const transformedData = transform(parsedFile);

    await load(transformedData).then(() => {
      transformedData.relationships.forEach((relationship) => {
        edges.fromRelationships.push({
          name: 'has_src',
          from: relationship.handle,
          to: relationship.src
        });
        edges.fromRelationships.push({
          name: 'has_dst',
          from: relationship.handle,
          to: relationship.dst
        });
      });
    });
  }

  // Return edges when loads have finished
  return edges;
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
    return session.close();
  }).then(() => {
    return driver.close();
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