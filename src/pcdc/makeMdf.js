import XLSX from 'xlsx';
import Node from '../lib/Node.js';

const makeMdfPcdc = async () => {
  // PCDC stub - needs a proper home
  const rows = rowsGenerator();

  for (const row of rows) {
    let node = new Node({
      handle: row['PCDC Table PT'],
      model: 'PCDC',
    });

    console.log(row);
  }
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
