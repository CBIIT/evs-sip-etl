import ActionType from '../ActionType.js';
import makeMdfPcdc from './makeMdfPcdc.js';

/**
 * Manages the creation of MDF files
 * 
 * @property {Object} actions A map of action names to action functions
 */
export default class MdfMaker extends ActionType {
  /**
   * Constructor
   */
  constructor() {
    super();

    this._actions = {
      pcdc: makeMdfPcdc,
    };
  };
};