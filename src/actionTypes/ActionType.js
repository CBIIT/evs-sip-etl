/**
 * Superclass of all action types
 * 
 * @property {object} actions A map of action names to action functions
 */
export default class ActionType {
  _actions;

  /**
   * Constructor
   */
  constructor() {
  }

  /**
   * Getter for actions
   */
  get actions() {
    return this._actions;
  }

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
    await this._actions[actionName]();
    console.log(`Finished action ${actionName}`)
  }

  /**
   * Finds out whether the the specified action exists
   * 
   * @param {String} actionName The name of the action
   * @returns {Boolean} True iff the action exists
   */
  async hasAction(actionName) {
    return this._actions.hasOwnProperty(actionName);
  }

  /**
   * Lists the action names
   * @returns {String[]} The action names
   */
  async getActionNames() {
    return Object.keys(this._actions);
  }
}