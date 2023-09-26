import fs from 'fs';
import neo4j from 'neo4j-driver';

/**
 * Class for patching Neo4j data from JSON files
 * Supports CTDC and ICDC so far
 * 
 * @property {object} _driver Neo4j driver
 * @property {string} _model The name of the dictionary (eg: 'CTDC' or 'ICDC')
 */
export default class JsonPatcher {
  // Instance properties
  _driver = null;
  _model = '';

  /**
   * Constructor
   */
  constructor(model) {
    this._model = model;
  };

  /**
   * Connects to a Neo4j database
   *
   * @async
   * @param {object} connection Neo4j connection details
   * @returns {void}
   */
  async connect(connection) {
    console.log('Connecting to Neo4j...');

    this._driver = neo4j.driver(
      connection.uri,
      neo4j.auth.basic(connection.user, connection.pass)
    );

    console.log('Connected to Neo4j');
  }

  /**
   * Patches Neo4j data from additional source data files
   *
   * @async
   * @param {string} jsonPath Path to the JSON file used to add data to Neo4j
   * @returns {void}
   */
  async patch(jsonPath) {
    let nodes = JSON.parse(fs.readFileSync(jsonPath));

    console.log('Patching NCIt codes...');

    for (const nodeName in nodes) {
      const node = nodes[nodeName];
      const nodeNcitCode = node.n_n_code;
      const properties = node.properties;

      await this._patchNode(nodeNcitCode, nodeName);

      for (const property of properties) {
        const propertyName = property.p_name;
        const propertyNcitCode = property.p_n_code;
        const values = property.values;

        await this._patchProperty(propertyNcitCode, nodeName, propertyName);

        for (const value of values) {
          const valueName = value.v_name;
          const valueNcitCode = value.v_n_code;

          await this._patchValue(valueNcitCode, nodeName, propertyName, valueName);
        }
      }
    }

    console.log('Finished patching NCIt codes');

    // on application exit:
    console.log('Closing Neo4j connection...');
    await this._driver.close();
    console.log('Closed Neo4j connection');

    return;
  }

  /**
   * @async
   * @param {string} ncitCode The node's NCIt code
   * @param {string} nodeName The node's name
   */
  async _patchNode(ncitCode, nodeName) {
    const session = this._driver.session();

    if (!ncitCode) {
      console.log(`No NCIt code for node ${nodeName}`);
      return;
    }

    try {
      console.log(`Assigning NCIt code ${ncitCode} to node "${nodeName}"...`);

      const result = await session.run(
        `
          MATCH (n:node)
          WHERE n.handle=$nodeName
            AND n.model=$model
          SET n.ncit_code=$ncitCode
          RETURN n.handle, n.ncit_code;
        `,
        {
          model: this._model,
          ncitCode: ncitCode,
          nodeName: nodeName,
        }
      );
      const record = result.records[0];

      if (!record) {
        console.log(`Couldn't find node ${nodeName}!`);
        return;
      }

      console.log(`Assigned NCIt code ${record.get('n.ncit_code')} to node ${record.get('n.handle')}`);
    } finally {
      await session.close();
    }
  }

  /**
   * @async
   * @param {string} ncitCode The property's NCIt code
   * @param {string} nodeName The node's name
   * @param {string} propertyName The property's name
   */
  async _patchProperty(ncitCode, nodeName, propertyName) {
    const session = this._driver.session();

    if (!ncitCode) {
      console.log(`No NCIt code for property ${nodeName}.${propertyName}`);
      return;
    }

    try {
      console.log(`Assigning NCIt code ${ncitCode} to property ${nodeName}.${propertyName}...`);

      const result = await session.run(
        `
          MATCH (p:property)
            MATCH (p)<--(n:node)
          WHERE n.handle=$nodeName
            AND p.handle=$propertyName
            AND n.model=$model
          SET p.ncit_code=$ncitCode
          RETURN p.handle, p.ncit_code, n.handle;
        `,
        {
          model: this._model,
          ncitCode: ncitCode,
          nodeName: nodeName,
          propertyName: propertyName,
        }
      );
      const record = result.records[0];

      if (!record) {
        console.log(`Couldn't find property ${nodeName}.${propertyName}!`);
        return;
      }

      console.log(`Assigned NCIt code ${record.get('p.ncit_code')} to property ${record.get('n.handle')}.${record.get('p.handle')}`);
    } finally {
      await session.close();
    }
  }

  /**
   * @async
   * @param {string} ncitCode The value's NCIt code
   * @param {string} nodeName The node's name
   * @param {string} propertyName The property's name
   * @param {stirng} valueName The value's name
   */
  async _patchValue(ncitCode, nodeName, propertyName, valueName) {
    const session = this._driver.session();

    if (!ncitCode) {
      console.log(`No NCIt code for value ${nodeName}.${propertyName}.${valueName}`);
      return;
    }

    try {
      console.log(`Assigning NCIt code ${ncitCode} to value ${nodeName}.${propertyName}.${valueName}...`);

      const result = await session.run(
        `
          MATCH (p:property)
            MATCH (p)<--(n:node)
            MATCH (vs:value_set)<--(p)
            MATCH (v:term)<--(vs)
          WHERE n.model=$model
            AND n.handle=$nodeName
            AND p.handle=$propertyName
            AND v.value=$valueName
          SET v.ncit_code=$ncitCode
          RETURN v.ncit_code, n.handle, p.handle, v.value;
        `,
        {
          model: this._model,
          ncitCode: ncitCode,
          nodeName: nodeName,
          propertyName: propertyName,
          valueName: valueName,
        }
      );
      const record = result.records[0];

      if (!record) {
        console.log(`Couldn't find value ${nodeName}.${propertyName}.${valueName}!`);
        return;
      }

      console.log(`Assigned NCIt code ${record.get('v.ncit_code')} to value ${record.get('n.handle')}.${record.get('p.handle')}.${record.get('v.value')}`);
    } finally {
      await session.close();
    }
  }
};
