import path from 'path';
import Node from '../lib/Node.js';
import nodeMap from '../mappings/nodeMap.js';
import Relationship from '../lib/Relationship.js';
import relationshipMap from '../mappings/relationshipMap.js';

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

  if (parsedFile && parsedFile.hasOwnProperty('links')) {
    // Build MDB Relationships
    parsedFile.links.forEach(link => {
      let relationshipProps = buildProps(relationshipMap, link);
      relationshipProps.src = node.handle;
      const relationship = new Relationship(relationshipProps);
      transformedData.relationships.push(relationship);
    });
  }

  return transformedData;
};

/**
 * Builds object properties for node construction
 * 
 * @param {Object} propMapping Map of MDB fields to YAML fields
 * @param {Object} propsRaw Object representation of node fields
 * 
 * @returns {Object} Instance properties mapped to values
 */
const buildProps = (propMapping, propsRaw) => {
    const props = Object.keys(propMapping).reduce((tempProps, prop) => {
      const sourceProp = propMapping[prop];
      if (propsRaw && propsRaw.hasOwnProperty(sourceProp)) {
        tempProps[prop] = propsRaw[sourceProp];
      }

      return tempProps;
    }, {});

    return props;
};

export default transform;