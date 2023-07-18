import XLSX from 'xlsx';

/**
 * Yields spreadsheet rows
 * 
 * @param {string} filepath Path to the spreadsheet
 * @yields {object} Object representation of a row
 */
const generateRows = function* (filepath) {
  try {
    var workbook = XLSX.readFile(filepath);
    var wsNames = workbook.SheetNames;
    var wsName = wsNames[wsNames.length - 1];
    var ws = workbook.Sheets[wsName];
    var rows = XLSX.utils.sheet_to_json(ws);

    for (const row of rows) {
      // Trim leading and trailing whitespace
      for (const prop in row) {
        if (typeof row[prop] === 'string') {
          row[prop] = row[prop]?.trim();
        }
      }

      yield row;
    }
  } catch (err) {
    console.log(err);
  }
};

export default generateRows;