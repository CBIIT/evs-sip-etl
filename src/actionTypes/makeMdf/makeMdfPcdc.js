import fs from 'fs';
import XLSX from 'xlsx';
import yaml from 'js-yaml';

const makeMdfPcdc = async () => {
  const nodes = {};
  const rows = rowsGenerator();
  let lastPropName = '';

  for (const row of rows) {
    const category = row.Project?.trim();
    const nodeName = row['PCDC Table PT']?.trim();
    const propName = row['NCIt PT']?.trim();
    const propType = row['Has PCDC Data Type PT']?.trim();
    const propDesc = row['NCIt Definition']?.trim();

    // Provision a new category
    if (!nodes.hasOwnProperty(category)) {
      nodes[category] = {};
    }

    // Provision a new node
    if (!nodes[category].hasOwnProperty(nodeName)) {
      nodes[category][nodeName] = {};
    }

    // Provision a new property, or add a value to a property
    if (propType) {
      const prop = {
        desc: propDesc,
        type: propType?.toLowerCase() == 'code' ? [] : propType,
      }

      // Store the prop
      nodes[category][nodeName][propName] = prop;

      // Update last property name
      lastPropName = propName;
    } else {
      const valueName = propName;

      // Sometimes, the spreadsheet specifies a type that's not "code" but
      //  is still followed by rows of permissible values.
      if (Array.isArray(nodes[category][nodeName][lastPropName].type)) {
        nodes[category][nodeName][lastPropName].type?.push(valueName);
      }
    }
  }

  // Transform and dump to YAML file
  const modelDescription = await transformToNodeMap(nodes);
  const propDefinitions = await transformToPropMap(nodes);
  await writeYamlFile(modelDescription, 'output/pcdc-model-file.yaml');
  await writeYamlFile(propDefinitions, 'output/pcdc-model-properties-file.yaml');
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
 * Transforms node map in preparation for node YAML dump
 * @param {Object} map  The node map to transform
 * @returns {Object} The transformed node map
 */
const transformToNodeMap = async (map) => {
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
 * Transforms node map in preparation for property YAML dump
 * @param {Object} map  The node map to transform
 * @returns {Object} The transformed node map
 */
const transformToPropMap = async (map) => {
  const newMap = {
    PropDefinitions: {},
  };

  // Transform categories and nodes to nodes
  for (const category in map) {
    // Build list of nodes
    for (const nodeName in map[category]) {
      // Build node's list of properties
      for (const propName in map[category][nodeName]) {
        const prop = map[category][nodeName][propName];
        newMap.PropDefinitions[`${category}.${nodeName}.${propName}`] = {
          Desc: prop.desc,
          Type: prop.type,
        };
      }
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
  const dump = yaml.dump(jsObj, {
    lineWidth: -1,
  });
  fs.writeFileSync(path, dump, 'utf8');
};

export default makeMdfPcdc;
