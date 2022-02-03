import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import Node from './lib/Node.js';
import nodeMap from './mappings/nodeMap.js';
import Property from './lib/Property.js';
import Relationship from './lib/Relationship.js';

/**
 * Extracts data from dictionary files
 */
const extract = () => {
  const dataDir = process.env.DATA_DIR;
  let filepaths = [];

  filepaths = [`${dataDir}${path.sep}aligned_reads.yaml`];

  filepaths.forEach(path => {
    const parsedFile = extractFile(path);

    // Skip invalid files
    if (!isValid(parsedFile)) {
      // Log the incident
      // stub

      return;
    }

    // Build MDB node
    const nodeProps = buildProps(nodeMap, parsedFile);
    const node = new Node(nodeProps);

    console.log(node);
  });
};

/**
 * Converts a YAML file into an Object
 * 
 * @param {string} path The path to the file
 * 
 * @returns {Object} An Object representation of the file
 */
const extractFile = (path) => {
  try {
    return yaml.load(fs.readFileSync(path, 'utf8'));
  } catch (e) {
    console.log(e);
    // Log the incident
    // stub
  }
};

/**
 * Validates the parsed file
 * 
 * @param {Object} parsedFile The Object representation of the YAML data
 * 
 * @returns {boolean} Whether or not the YAML data is valid
 */
const isValid = (parsedFile) => {
  // stub
  return true;
};

/**
 * Builds object properties for node construction
 * 
 * @param {Object} propMapping Map of MDB fields to YAML fields
 * @param {Object} parsedFile Object representation of YAML data
 * 
 * @returns {Object} Instance properties mapped to values
 */
const buildProps = (propMapping, parsedFile) => {
    const nodeProps = Object.keys(propMapping).reduce((props, prop) => {
      props[prop] = parsedFile[propMapping[prop]];

      return props;
    }, {});

    return nodeProps;
};

export default extract;