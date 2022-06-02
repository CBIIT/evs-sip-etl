import formatName from './formatName.js';
import generateNanoId from './generateNanoId.js';

// Names of instance properties
const PROP_NAMES = [
  '_desc',
  '_handle',
  '_label',
  '_model',
  '_name',
  '_nanoid',
];

/**
 * Corresponds to an entity in MDB's model
 * Serves as the superclass of node, property, etc.
 * 
 * @property {string} _desc A description of the entity
 * @property {string} _handle The MDF-formatted name of the entity
 * @property {string} _label Identifies the entity's type in Neo4j
 * @property {string} _model The data commons that the entity is from
 * @property {string} _name The name of the entity
 * @property {string} _nanoid The entity's identifier
 */
export default class Entity {
  /**
   * Constructor
   * 
   * @param {Object} props Map of property names to values
   */
  constructor(props) {
    // Set instance properties that are passed through the constructor
    for (const propName of PROP_NAMES) {
      if (props.hasOwnProperty(propName)) {
        this[propName] = props[propName];
      } else {
        this[propName] = undefined;
      }
    }

    this._handle = formatName(this.handle);
    this._label = 'entity';
    this._nanoid = generateNanoId();
  };

  /**
   * Description getter
   * 
   * @returns {string} The entity's description
   */
  get desc() {
    return this._desc;
  }

  /**
   * Handle getter
   * 
   * @returns {string} The entity's handle
   */
  get handle() {
    return this._handle;
  }

  /**
   * Label getter
   * 
   * @returns {string} The entity's label
   */
  get label() {
    return this._label;
  }

  /**
   * Model getter
   * 
   * @returns {string} The model that the entity belongs to
   */
  get model() {
    return this._model;
  }

  /**
   * Name getter
   * 
   * @returns {string} The entity's name
   */
  get name() {
    return this._name;
  }

  /**
   * @returns {string} The entity's nanoid
   */
  get nanoid() {
    return this._nanoid;
  }
};