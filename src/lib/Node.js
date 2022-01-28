/**
 * Corresponds to a Node in MDB's model
 * 
 * @property {string} desc A description of the Node
 * @property {string} handle The name of the Node
 * @property {string} model The data commons that the Node is from
 * @property {string} nanoid The Node's identifier
 */
export default Node = class {
  // Private instance properties
  #desc = null;
  #handle = null;
  #model = null;
  #nanoid = null;

  constructor(desc, handle, model, nanoid) {
    this.#desc = desc;
    this.#handle = handle;
    this.#model = model;
    this.#nanoid = nanoid;
  };
};