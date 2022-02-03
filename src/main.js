import { readdirSync } from 'fs';
import path from 'path';
import extract from './extract.js';
import transform from './transform.js';
import load from './load.js';

const main = () => {
  const filePaths = filesGenerator();

  // Go through each file
  for (const filePath of filePaths) {
    const parsedFile = extract(filePath);
    const transformedData = transform(parsedFile);
    //load();
    console.log(transformedData);
    return;
  }
};

/**
 * Yields names of files in the data directory
 */
const filesGenerator = function* () {
  const dataDir = process.env.DATA_DIR;

  try {
    const filenames = readdirSync(dataDir);

    for (const filename of filenames) {
      // Skip definition files
      if (filename[0] == '_') {
        continue;
      }

      // Skip non-YAML files
      if (filename.split('.').at(-1).toLowerCase() !== 'yaml') {
        continue;
      }

      yield `${dataDir}${path.sep}${filename}`;
    }
  } catch (err) {
    console.log(err);
  }
};

export default main;