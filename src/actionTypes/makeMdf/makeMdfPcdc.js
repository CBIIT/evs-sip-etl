import fs from 'fs';
import XLSX from 'xlsx';
import yaml from 'js-yaml';

const makeMdfPcdc = async () => {
  const nodes = {};
  const rows = rowsGenerator();

  for (const row of rows) {
    const category = row.Project;
    const nodeName = row['PCDC Table PT'];
    const propName = row['NCIt PT'];
    const propType = row['Has PCDC Data Type PT'];

    // Provision a new category
    if (!nodes.hasOwnProperty(category)) {
      nodes[category] = {};
    }

    // Provision a new Node
    if (!nodes[category].hasOwnProperty(nodeName)) {
      nodes[category][nodeName] = {};
    }

    // Provision a new Property
    if (propType) {
      nodes[category][nodeName][propName] = {
        type: propType,
      };
    }
  }

  // Transform and dump to YAML file
  await writeYamlFile(await transformNodeMap(nodes));
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

/**
 * Transforms node map in preparation for YAML dump
 * @param {Object} map  The node map to transform
 * @returns {Object} The transformed node map
 */
const transformNodeMap = async (map) => {
  const newMap = {
    Nodes: {},
    Relationships: {},
  };

  // Transform categories and nodes to nodes
  for (const category in map) {
    // Build list of nodes
    for (const nodeName in map[category]) {
      const node = {
        Category: category,
        Props: [],
      };

      // Build node's list of properties
      for (const propName in map[category][nodeName]) {
        node.Props.push(propName);
      }

      newMap.Nodes[nodeName] = node;
    }
  }

  return newMap;
};

/**
 * Writes the provided JSON object to a YAML file
 * 
 * @param {Object} jsObj The object to write to YAML
 * @param {String} path The path and filename of the output file
 */
const writeYamlFile = async (jsObj, path) => {
  const dump = yaml.dump(jsObj);
  fs.writeFileSync('output/pcdc-model-file.yaml', dump, 'utf8');
};

export default makeMdfPcdc;
