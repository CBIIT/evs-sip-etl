import ActionType from '../ActionType.js';
import updateNCIt from './updateNCIt.js';

/**
 * Validates input files
 * 
 * @property {Object} actions A map of action names to action functions
 */
export default class Updater extends ActionType {
  /**
   * Constructor
   */
  constructor() {
    super();

    this._actions = {
      ncit: updateNCIt,
    };
  }
};