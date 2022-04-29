import fs from 'fs';
import XLSX from 'xlsx';
import Node from '../../lib/Node.js';

const makeMdfPcdc = async () => {
  const nodes = {};
  const rows = rowsGenerator();

  for (const row of rows) {
    const category = row.Project;

    // Provision a new category
    if (!nodes.hasOwnProperty(category)) {
      nodes[category] = {};
    }

    //console.log(row);

    let node = new Node({
      handle: row['PCDC Table PT'],
      model: 'PCDC',
    });
  }
  console.log(nodes);

  //fs.writeFile('output/pcdc_model_file.yaml');
};

/**
 * Yields spreadsheet rows
 */
const rowsGenerator = function* () {
  try {
    const filename = 'data/pcdc/PCDC_Terminology.xls';
    var workbook = XLSX.readFile(filename);
    var wsNames = workbook.SheetNames;
    var wsName = wsNames[wsNames.length - 1];
    var ws = workbook.Sheets[wsName];
    var rows = XLSX.utils.sheet_to_json(ws);

    for (const row of rows) {
      yield row;
    }
  } catch (err) {
    console.log(err);
  }
};

export default makeMdfPcdc;
