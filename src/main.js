import actions from './lib/actions.js';

/**
 * Runs user's desired action.
 */
const main = async () => {
  const chosenAction = process.argv[2];
  const action = actions[chosenAction];

  if (!action) {
    console.log(`Usage: npm run [action]\n`);
    console.log(`Actions:`);
    Object.keys(actions).forEach((actionName) => {
      console.log(`  - ${actionName}`);
    });
    return;
  }

  console.log(`Performing action ${chosenAction}...`);
  action();
}

export default main;