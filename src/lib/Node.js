import nodeMap from '../mappings/nodeMap.js';
import generateNanoId from './generateNanoId.js';

/**
 * Corresponds to a Node in MDB's model
 * 
 * @property {string} desc A description of the Node
 * @property {string} handle The name of the Node
 * @property {string} label Identifies this as an MDB node in Neo4j
 * @property {string} model The data commons that the Node is from
 * @property {string} nanoid The Node's identifier
 */
export default class Node {
  // Instance properties
  category = null;
  desc = null;
  handle = null;
  label = 'node';
  model = null;
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
  };

  /**
   * Setter for category
   * 
   * @param {String} category The category
   */
  setCategory(category) {
    this.category = category;
  }
};