import actionTypes from './lib/actionTypes.js';

/**
 * Runs user's desired action.
 */
const main = async () => {
  const actionTypeName = process.argv[2];
  const actionName = process.argv[3];
  const actionType = new actionTypes[actionTypeName]();

  // Explain usage if arguments were not provided
  if (!(actionTypeName && actionName)) {
    await explainUsage();

    return;
  }

  // Handle nonexistent action type
  if (!actionType) {
    console.log(`Action type ${actionTypeName} doesn't exist!`);
  }

  console.log(`Performing action ${actionTypeName} ${actionName}...`);
  await actionType.perform(actionName);
};

const explainUsage = async () => {
  await explainSyntax();
  await listActions();
};

const explainSyntax = async () => {
  console.log(`Usage: npm run [action type] [action]\n`);
};

const listActions = async () => {
  console.log(`Action types and actions:`);
  for (const actionTypeName in actionTypes) {
    const actionType = new actionTypes[actionTypeName]();
    const actionNames = await actionType.getActionNames();

    console.log(`  - ${actionTypeName}`);
    actionNames.forEach((actionName) => {
      console.log(`    - ${actionName}`);
    });
  }
};

export default main;