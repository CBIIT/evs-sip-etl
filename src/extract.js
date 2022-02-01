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

  filepaths.forEach(dir => {
    const parsedFile = extractFile(dir);
    const nodeProps = Object.keys(nodeMap).reduce((props, prop) => {
      props[prop] = parsedFile[nodeMap[prop]];

      return props;
    }, {});
    const node = new Node(nodeProps);

    console.log(node);
  });
};

const extractFile = (dir) => {
  try {
    return yaml.load(fs.readFileSync(dir, 'utf8'));
  } catch (e) {
    console.log(e);
  }
};

export default extract;