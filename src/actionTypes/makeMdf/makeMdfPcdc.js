import fs from 'fs';
import yaml from 'js-yaml';
import formatName from '../../lib/formatName.js';
import generateRows from '../../lib/generateRows.js';

const inputDir = process.env.DATA_DIR_PCDC ?? 'data/pcdc';
const outputDir = process.env.OUTPUT_DIR ?? 'output';

const makeMdfPcdc = async () => {
  const nodes = {};
  const rows = generateRows(`${inputDir}/PCDC_Terminology.xlsx`);
  let lastPropName = '';

  for (const row of rows) {
    const category = row.Project;
    const nodeName = formatName(row['PCDC Table PT']);
    let propName = row['PCDC PT'];
    const propType = row['Has PCDC Data Type PT']?.toLowerCase();
    const propDesc = row['NCIt Definition'];

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
        type: propType,
        vals: {/* eg:
          val1: true,
          val2: true,
          etc.
      */},
      }

      // Formating property name 
      propName = formatName(propName);
      
      // Store the prop
      nodes[category][nodeName][propName] = prop;

      // Update last property name
      lastPropName = propName;
    } else if (!nodes[category][nodeName][lastPropName]) {
      // Property doesn't exist
      // TODO let the error handler decide what to do
      console.log(`
        ${category}'s node ${nodeName} has no property named "${lastPropName}"!
        ${propName} is possibly an orphaned permissible value.
      `);
    } else {
      // In this context, we're using the name of a permissible value,
      //  not the name of a property
      const valName = propName;

      // Add permissible value to list
      // Sometimes, the spreadsheet specifies a type that's not "code" but
      //  is still followed by rows of permissible values.
      nodes[category][nodeName][lastPropName].vals[valName] = true;
    }
  }

  // Transform and dump to YAML file
  const modelDescription = await transformToNodeMap(nodes);
  const propDefinitions = await transformToPropMap(nodes);
  await writeYamlFile(modelDescription, `${outputDir}/pcdc-model.yaml`);
  await writeYamlFile(propDefinitions, `${outputDir}/pcdc-model-properties.yaml`);
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
        Tags: {
          Category: category
        },
        Props: [],
      };

      // Build node's list of properties
      for (const propName in map[category][nodeName]) {
        node.Props.push(propName);
      }

      newMap.Nodes[`${category}.${nodeName}`] = node;
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

        // Build transformed property
        const newProp = {
          Desc: prop.desc,
          Type: prop.type,
        };

        // If the type is `code`, then Type should be a list of permissible values instead
        if (prop.type === 'code' && Object.keys(prop.vals).length) {
          newProp.Enum = Object.keys(prop.vals);
          delete newProp.Type;
        }

        // Only save the property if it has a type
        // TODO handle problematic types through the error handler
        if (newProp.Type || newProp.Enum) {
          newMap.PropDefinitions[`${category}.${nodeName}.${propName}`] = newProp;
        }
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
