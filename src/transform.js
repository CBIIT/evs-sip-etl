import path from 'path';
import Node from './lib/Node.js';
import nodeMap from './mappings/nodeMap.js';

/**
 * Builds MDB nodes from the Object representation of YAML data
 */
const transform = (parsedFile) => {
  let transformedData = {
    node: null, // One object (should be one node per file)
    properties: [],
    relationships: [/*
      many_to_one: 'node name',
      one_to_one: 'other node name'
    */],
  };
  // Build MDB Node
  const nodeProps = buildProps(nodeMap, parsedFile);
  const node = new Node(nodeProps);

  transformedData.node = node;

  return transformedData;
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

export default transform;