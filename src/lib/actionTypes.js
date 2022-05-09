import gdcEtl from '../gdc/gdcEtl.js';
import MdfMaker from '../actionTypes/makeMdf/MdfMaker.js';
import Validator from '../actionTypes/validate/Validator.js';

const actionTypes = {
  //gdcEtl,
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