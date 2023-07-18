import ActionType from '../ActionType.js';
import validatePcdc from './validatePcdc.js';

/**
 * Validates input files
 * 
 * @property {Object} actions A map of action names to action functions
 */
export default class Validator extends ActionType {
  /**
   * Constructor
   */
  constructor() {
    super();

    this._actions = {
      pcdc: validatePcdc,
    };
  }
};