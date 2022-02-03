/**
 * Corresponds to a Relationship in MDB's model
 * 
 * @property {string} desc A description of the Relationship
 * @property {string} handle The name of the Relationship
 * @property {bool} isRequired Whether or not the Relationship is required
 * @property {string} label Identifies this as an MDB relationship in Neo4j
 * @property {string} model The data commons that the Relationship is from
 * @property {string} multiplicity One to many, many to one, etc.
 * @property {string} nanoid The Relationship's identifier
 */
export default class Relationship {
  // Private instance properties
  desc = null;
  handle = null;
  isRequired = false;
  label = 'relationship';
  model = null;
  multiplicity = 'many_to_many';
  nanoid = null;

  constructor(desc, handle, isRequired, model, multiplicity, nanoid) {
    this.desc = desc;
    this.handle = handle;
    this.isRequired = isRequired;
    this.multiplicity = multiplicity;
    this.model = model;
    this.nanoid = nanoid;
  };
};