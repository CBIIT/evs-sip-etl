import ActionType from '../ActionType.js';
import patchGdc from './patchGdc.js';

/**
 * Manages patching Neo4j data
 * 
 * @property {Object} actions A map of action names to action functions
 */
export default class GdcPatcher extends ActionType {
  /**
   * Constructor
   */
  constructor() {
    super();

    this._actions = {
      gdc: patchGdc,
    };
  };
};