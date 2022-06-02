// Names of instance properties that Entity doesn't have
const PROP_NAMES = [
  '_isRequired',
  '_pattern',
  '_units',
  '_valueDomain',
];

/**
 * Corresponds to a property in MDB's model
 * 
 * @property {string} _desc A description of the property
 * @property {string} _handle The MDF-formatted name of the property
 * @property {boolean} _isRequired Whether or not the Property is required
 * @property {string} _label Identifies this as an MDB property in Neo4j
 * @property {string} _model The data commons that the property is from
 * @property {string} _name The name of the property
 * @property {string} _nanoid The property's identifier
 * @property {UNKNOWN} _pattern UNKNOWN
 * @property {string} _units UNKNOWN
 * @property {UNKNOWN} _valueDomain UNKNOWN
 */
export default class Property extends Entity {
  constructor(props) {
    super(props);

    // Set uninherited instance properties that are passed through the constructor
    for (const propName of PROP_NAMES) {
      if (props.hasOwnProperty(propName)) {
        this[propName] = props[propName];
      } else {
        this[propName] = undefined;
      }
    }

    this._label = 'property';
  };

  /**
   * IsRequired getter
   * 
   * @returns {boolean} Whether the property is required
   */
  get isRequired() {
    return this._isRequired;
  }

  /**
   * Pattern getter
   * 
   * @returns {unknown} The property's pattern
   */
  get pattern() {
    return this._pattern;
  }

  /**
   * Units getter
   * 
   * @returns {string} The property's units
   */
  get units() {
    return this._units;
  }

  /**
   * Value domain getter
   * 
   * @returns {unknown} The property's value domain
   */
  get valueDomain() {
    return this._valueDomain;
  }
};