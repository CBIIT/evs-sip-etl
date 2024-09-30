// import fs from 'fs';
import neo4j from "neo4j-driver";
import Logger from "../../lib/Logger.js";

const neo4jUri = process.env.NEO4J_URI;
const neo4jUser = process.env.NEO4J_USER;
const neo4jPass = process.env.NEO4J_PASS;
const driver = neo4j.driver(neo4jUri, neo4j.auth.basic(neo4jUser, neo4jPass));

const ncitUrl = process.env.NCIT_URL_LIST;

const logger = new Logger();

/**
 * Updated the NCIt Neo4j data from ..
 * @returns {void}
 */
const updateNCIt = async () => {
  console.log("Updating NCIt codes...");


  const ncitCodes = await getAllNCItcodes();
  const ncitCodesLength = ncitCodes.length;
  const ncitCodesBatchLength = 100;

  //loop through all NCIt codes by 50 to the end of the list
  for (let index = 0; index < ncitCodes.length; index += ncitCodesBatchLength) {
    const ncitCodesBatch = ncitCodes.slice(index, index + ncitCodesBatchLength);

    const url = ncitUrl + ncitCodesBatch.toString();

    const NCItData = await fetchNCIt(url);

    await updateNCItcodes(NCItData, ncitCodesLength, index);
  }

  console.log("Finished NCIt codes synonyms updates");

  // on application exit:
  await driver.close();

  return;
};

const getAllNCItcodes = async () => {
  const session = driver.session();

  let ncitList = [];

  try {
    const result = await session.run("MATCH (c:ncitcode) RETURN c.ncit_code");

    const records = result.records;

    ncitList = records.map((data) => data._fields[0]);
  } finally {
    await session.close();
  }

  return ncitList;
};

// Function to fetch data from the API
async function fetchNCIt(apiUrl) {
  try {
    // Make the request to the API
    const response = await fetch(apiUrl);

    // Check if the response is ok (status code in the range 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the response as JSON
    const ncitDetails = await response.json();

    // Return the fetched data
    return ncitDetails;
  } catch (error) {
    // Log any errors that occur during the fetch
    console.error("Error fetching data:", error);
    logger.log("Error fetching:", apiUrl);

    // Return an error or an empty object/array to handle the error case
    return { error: "Failed to fetch data" };
  }
}

const updateNCItcodes = async (NCItData, ncitCodesLength, ncitCodesIndex) => {
  const session = driver.session();
  let logString = "Updating NCIt codes synonyms...\n";

  for(let i = 0; i < NCItData.length; i++) {
    const ncitCode = NCItData[i].code;
    const ncitName = NCItData[i].name;
    const ncitDefinitions = filterSource(NCItData[i].definitions);
    const ncitSynonyms = filterSource(NCItData[i].synonyms);

    try {
      const result = await session.run(
        "MATCH (c:ncitcode) WHERE c.ncit_code=$ncitCode SET c.ncit_pt=$ncitName, c.ncit_synonyms=$ncitSynonyms, c.ncit_definitions=$ncitDefinitions RETURN c.ncit_code, c.ncit_pt;",
        {
          ncitCode: ncitCode,
          ncitName: ncitName,
          ncitSynonyms: ncitSynonyms,
          ncitDefinitions: ncitDefinitions,
        }
      );
      const record = result.records[0];

      ncitCodesIndex++;

      logString += `Updated ${ncitCodesIndex} NCIt codes of ${ncitCodesLength} - ${record.get("c.ncit_code")} synonyms\n`;

    } catch (error) {
      // Log any errors that occur during the fetch
      console.log("Error NCIt code:", ncitCode);
      console.error("Error Neo4j SET data:", error);
      logger.log("Error SET:" + ncitCode);
    }
  }

  console.log(logString);
  logger.log(logString);

  //close seesion
  await session.close();

  return;
};

const filterSource = (data) => {
  if (data !== undefined) {
    data = data.filter((item) => item.source == "NCI");
  } else {
    data = [];
  }
  return JSON.stringify(data);
};

export default updateNCIt;
