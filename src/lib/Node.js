import nodeMap from '../mappings/nodeMap.js';

/**
 * Corresponds to a Node in MDB's model
 * 
 * @property {string} desc A description of the Node
 * @property {string} handle The name of the Node
 * @property {string} model The data commons that the Node is from
 * @property {string} nanoid The Node's identifier
 */
export default class Node {
  // Private instance properties
  desc = null;
  handle = null;
  model = null;
  nanoid = null;

  constructor(props) {
    for (const prop in nodeMap) {
      this[prop] = props[prop] ?? null;
    }
  };
};