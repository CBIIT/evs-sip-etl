import nodeMap from '../mappings/nodeMap.js';
import formatName from './formatName.js';
import generateNanoId from './generateNanoId.js';

/**
 * Corresponds to a Node in MDB's model
 * 
 * @property {string} desc A description of the node
 * @property {string} handle The MDF-formatted name of the node
 * @property {string} label Identifies the entity's type in Neo4j
 * @property {string} model The data commons that the entity is from
 * @property {string} name The name of the entity
 * @property {string} nanoid The entity's identifier
 * @property {string} desc A description of the Node
 * @property {string} handle The name of the Node
 * @property {string} label Identifies this as an MDB node in Neo4j
 * @property {string} model The data commons that the Node is from
 * @property {string} name The formatted name of the node
 * @property {string} nanoid The Node's identifier
 */
export default class Node {
  // Instance properties
  desc = null;
  handle = null;
  label = 'node';
  model = null;
  name = null;
  nanoid = generateNanoId();

  /**
   * Constructor
   * 
   * @param {Object} props Collection of properties mapped to values
   */
  constructor(props) {
    for (const prop in nodeMap) {
      this[prop] = props[prop] ?? this[prop] ?? null;
    }

    // Format the handle
    this.handle = formatName(this.handle);
  };
};