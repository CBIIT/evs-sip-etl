/**
 * Formats a Node or Property name to MDF specification
 * 
 * @param {string} name The name to format
 * @returns {string} The formatted name
 */
const formatName = (name) => {
  // Handle non-strings
  if (typeof name !== 'string') {
    //throw new Error(`Provided value ${name} is not a string!`);
    return name;
  }

  // Replace leading non-alphabetical or non-underscore characters with an underscore
  name = name.replaceAll(/^[^A-Za-z_]+/g, '_');

  // Replace non-alphanumeric, non-underscore, and non-period characters with an underscore
  name = name.replaceAll(/[^A-Za-z0-9_.]+/g, '_');

  // Collapse underscores
  name = name.replaceAll(/_+/g, '_');

  return name.toLowerCase();
};

export default formatName;