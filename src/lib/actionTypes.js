import gdcEtl from '../gdc/gdcEtl.js';
import MdfMaker from '../actionTypes/makeMdf/MdfMaker.js';

const actionTypes = {
  //gdcEtl,
  makeMdf: MdfMaker,
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