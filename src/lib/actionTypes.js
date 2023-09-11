// import gdcEtl from '../gdc/gdcEtl.js';
import Patcher from '../actionTypes/patch/Patcher.js';
import MdfMaker from '../actionTypes/makeMdf/MdfMaker.js';
import Validator from '../actionTypes/validate/Validator.js';

const actionTypes = {
  patch: Patcher,
  makeMdf: MdfMaker,
  validate: Validator,
};

export default actionTypes;

/**
 * Try this:
 * makeMdf
 *  - pcdc
 *  - ptdc
 * buildIndex
 *  - Gdc
 *  - Ctdc
 *  - etc.
 * 
 */