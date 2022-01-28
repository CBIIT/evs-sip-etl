import extract from './extract.js';
import transform from './transform.js';
import load from './load.js';

/*
import transform from './transform.js';
import load from './load.js';
*/

const main = () => {
  extract();
  transform();
  load();
};

export default main;