import ActionType from '../ActionType.js';
import patchCtdc from './patchCtdc.js';
import patchGdc from './patchGdc.js';

/**
 * Manages patching Neo4j data
 * 
 * @property {Object} actions A map of action names to action functions
 */
export default class Patcher extends ActionType {
  /**
   * Constructor
   */
  constructor() {
    super();

    this._actions = {
      ctdc: patchCtdc,
      gdc: patchGdc,
    };
  };
};