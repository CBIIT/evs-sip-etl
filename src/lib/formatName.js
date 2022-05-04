/**
 * Formats a Node or Property name to MDF specification
 * 
 * @param {string} name The name to format
 * @returns {string} The formatted name
 */
const formatName = (name) => {
  // Handle non-strings
  if (typeof name !== 'string') {
    throw new Error(`Provided value ${name} is not a string!`);
  }

  // Replace each space or series of consecutive spaces with an underscore
  name = name.toLowerCase();
  name = name.replaceAll(/[\-\/\\ ]+/g, '_');

  return name;
};

export default formatName;