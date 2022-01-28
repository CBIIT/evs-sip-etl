/**
 * Corresponds to a Property in MDB's model
 * 
 * @property {string} desc A description of the Property
 * @property {string} handle The name of the Property
 * @property {bool} isRequired Whether or not the Property is required
 * @property {string} model The data commons that the Property is from
 * @property {string} nanoid The Property's identifier
 * @property {UNKNOWN} pattern UNKNOWN
 * @property {UNKNOWN} units UNKNOWN
 * @property {UNKNOWN} value_domain UNKNOWN
 */
export default Property = class {
  // Private instance properties
  #desc = null;
  #handle = null;
  #isRequired = false;
  #model = null;
  #nanoid = null;
  #pattern = null;
  #units = null;
  #valueDomain = null;

  constructor(desc, handle, isRequired, model, nanoid, pattern, units, valueDomain) {
    this.#desc = desc;
    this.#handle = handle;
    this.#isRequired = isRequired;
    this.#model = model;
    this.#nanoid = nanoid;
    this.#pattern = pattern;
    this.#units = units;
    this.#valueDomain = valueDomain;
  };
};