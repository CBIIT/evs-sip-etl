import actions from './actions.js';

/**
 * Manages the creation of MDF files
 * 
 * @property {Object} actions A map of action names to action functions
 */
export default class MdfMaker {
  /**
   * Constructor
   */
  constructor() {
    this.actions = actions;
  };

  /**
   * Performs the specified action
   * 
   * @param {String} actionName The name of the action
   */
  async perform(actionName) {
    if (!this.hasAction(actionName)) {
      console.log(`Action ${actionName} doesn't exist!`);

      return;
    }

    console.log(`Performing action ${actionName}...`);
    await this.actions[actionName]();
  }

  /**
   * Finds out whether the the specified action exists
   * 
   * @param {String} actionName The name of the action
   * @returns {Boolean} True iff the action exists
   */
  async hasAction(actionName) {
    return this.actions.hasOwnProperty(actionName);
  }

  /**
   * Lists the action names
   * @returns {String[]} The action names
   */
  async getActionNames() {
    return Object.keys(this.actions);
  }
};