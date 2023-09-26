import JsonPatcher from '../../lib/JsonPatcher.js';

const patchIcdc = async () => {
  const connection = {
    uri: process.env.NEO4J_URI,
    user: process.env.NEO4J_USER,
    pass: process.env.NEO4J_PASS,
  };
  const inputDir = process.env.DATA_DIR_ICDC ?? 'data/icdc';
  const jsonPath = `${inputDir}/ICDC_Mappings.json`;

  const icdcPatcher = new JsonPatcher('ICDC');
  await icdcPatcher.connect(connection);
  await icdcPatcher.patch(jsonPath);
};

export default patchIcdc;
