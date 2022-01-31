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
    this.desc = props.desc ?? null;
    this.handle = props.handle ?? null;
    this.model = props.model ?? null;
    this.nanoid = props.nanoid ?? null;
  };
};