import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const extract = () => {
  const dataDir = process.env.DATA_DIR;
  let filepaths = [];

  filepaths = [`${dataDir}${path.sep}aligned_reads.yaml`];

  filepaths.forEach(dir => {
    extractFile(dir);
  });
};

const extractFile = (dir) => {
  try {
    const doc = yaml.load(fs.readFileSync(dir, 'utf8'));
    console.log(doc);
  } catch (e) {
    console.log(e);
  }
};

export default extract;