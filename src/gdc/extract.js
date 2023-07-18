import fs from 'fs';
import yaml from 'js-yaml';

/**
 * Generates an Object representation of a YAML dictionary file
 */
const extract = (filePath) => {
  const parsedFile = extractFile(filePath);

  // Skip invalid files
  if (!isValid(parsedFile)) {
    // Log the incident
    // stub

    return;
  }

  return parsedFile;
};

/**
 * Converts a YAML file into an Object
 * 
 * @param {string} filePath The path to the file
 * 
 * @returns {Object} An Object representation of the file
 */
const extractFile = (filePath) => {
  try {
    return yaml.load(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    console.log(err);
    // Log the incident
    // stub
  }
};

/**
 * Validates the parsed file
 * 
 * @param {Object} parsedFile The Object representation of the YAML data
 * 
 * @returns {boolean} Whether or not the YAML data is valid
 */
const isValid = (parsedFile) => {
  // stub
  return true;
};

export default extract;