import relationshipMap from '../mappings/relationshipMap.js';
import generateNanoId from './generateNanoId.js';

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
  // Instance properties
  desc = null;
  dst = null;
  handle = null;
  isRequired = false;
  label = 'relationship';
  model = 'GDC';
  multiplicity = null;
  nanoid = generateNanoId();
  src = null;

  /**
   * Constructor
   * 
   * @param {Object} props Collection of properties mapped to values
   */
  constructor(props) {
    for (const prop in relationshipMap) {
      this[prop] = props[prop] ?? this[prop] ?? null;
    }
  };
};