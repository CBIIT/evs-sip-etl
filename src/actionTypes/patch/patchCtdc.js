import JsonPatcher from '../../lib/JsonPatcher.js';

const patchCtdc = async () => {
  const connection = {
    uri: process.env.NEO4J_URI,
    user: process.env.NEO4J_USER,
    pass: process.env.NEO4J_PASS,
  };
  const inputDir = process.env.DATA_DIR_CTDC ?? 'data/ctdc';
  const jsonPath = `${inputDir}/CTDC_Mappings.json`;

  const ctdcPatcher = new JsonPatcher('CTDC');
  await ctdcPatcher.connect(connection);
  await ctdcPatcher.patch(jsonPath);
};

export default patchCtdc;
