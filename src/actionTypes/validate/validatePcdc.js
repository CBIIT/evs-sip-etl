import formatName from '../../lib/formatName.js';
import generateRows from '../../lib/generateRows.js';
import Node from '../../lib/Node.js';
import Property from '../../lib/Property.js';

/**
 * Validate Table (Bento Node) name
 * 
 * @param {string} name The name to validate
 * @returns {boolean} Whether or not the name is valid
 */
const isNodeValid = (name) => {
  const regex = new RegExp(/^[A-Za-z_][A-Za-z0-9_.]*$/);

  return regex.test(formatName(name));
};

/**
 * Validate Value (Bento Property) name
 * 
 * @param {string} name The name to validate
 * @returns {boolean} Whether or not the name is valid
 */
const isPropertyValid = (name) => {
  const regex = new RegExp(/^[A-Za-z_][A-Za-z0-9_.]*$/);

  return regex.test(formatName(name));
};

const validators = {
  node: {
    fn: isNodeValid,
    columnName: 'PCDC Table PT',
  },
  prop: {
    fn: isPropertyValid,
    columnName: 'PCDC PT',
  },
};

/**
 * Validate row
 * 
 * @param {object} row The row to validate
 * @param {number} i (Optional) The index of the row
 * @returns {boolean} Whether or not the row is valid
 */
const isRowValid = (row, i = undefined) => {
  let isValid = true;

  // Make a Node to validate
  const node = new Node({
    handle: formatName(row['PCDC Table PT']),
    name: row['PCDC Table PT'],
  });

  // Make a Property to validate
  const prop = new Property({
    
  });

  for (const type in validators) {
    const validator = validators[type];
    const columnName = validator.columnName;
    const val = row[columnName];
    const isFieldValid = validator.fn(val);
    isValid &= isFieldValid;

    if (!isFieldValid) {
      console.log(`Invalid ${type} value ${val} in row ${i} column ${columnName}`)
    }
  };

  return isValid;
};

/**
 * Validate spreadsheet
 * @returns {boolean} Whether or not the spreadsheet is valid
 */
const validatePcdc = () => {
  const filepath = 'data/pcdc/PCDC_Terminology.xls';
  const rows = generateRows(filepath);
  let isValid = true;
  let rowIndex = 2;

  // Validate each row
  for (const row of rows) {
    isValid &= isRowValid(row, rowIndex);
    rowIndex++;
  }

  return isValid;
};

export default validatePcdc;