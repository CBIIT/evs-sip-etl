# EVS-SIP GDC Data Loader (evs-sip-gdc-loader)

## About

This project reads GDC data from YAML files and loads the data into Neo4j.

### Data versioning

Currently, if a node's property needs to be changed, then it will just be changed.

In the future, if a node's property needs to be changed, then a new node will be created. The previous node and the new node will be linked with the `_to` and `_from` properties. All versions of a node will have a `_to` and `_from`, except:

- The earliest version will not have a `_from`
- The latest version will not have a `_to`

Read more about this Entity-State Model approach to versioning [here](<https://cbiit.github.io/bento-meta/model_versioning.html>).

## How to run this project

### Prerequisites

- Node.js v16
- Access to a Neo4j instance
- YAML files to import into Neo4j

### Import data files

The data extractor expects YAML files. Move the YAML files into a directory of your choice, such as `data/model`. Remember this directory for the next step, so that you specify it in the `.env` file.

### Assign environment variables

Make a copy of `.env.example`, and name the file `.env`. Then, replace the values of `.env` with values relevant to your deployment environment.

### Install Node.js packages

In a terminal, run the command `npm install`.

### Execute the code

In a terminal, run the command `node index.js` or `npm run test`.

## Project Structure

`index.js` is the ingress point for `src/main.js`.

`src/main.js` coordinates the extraction, transformation, and loading of data.

`src/extract.js` generates an Object representation of a YAML file.

`src/transform.js` constructs MDB nodes from the extracted data.

`src/load.js` loads the Neo4j data with the transformed data.

`lib` contains classes that represent nodes in the Bento MDB model.

`mappings` contains files defining the YAML fields that match corresponding MDB fields. If the fieldset of a YAML file changes, then edit the corresponding mapping in `mappings` instead of editing the constructor of MDB classes in `lib`.

## Glossary

Below is a glossary of terminology used in this project's README and code:

| Term | Definition |
| ---- | ---------- |
| MDB node | Any node (whether it's labeled "property", "relationship", "node", etc.) in the MDB model |
| MDB Node | A node labeled "node" in the MDB model |
| MDB Property | A node labeled "property" in the MDB model |
| MDB Relationship | A node labeled "relationship" in the MDB model |

## Learn More

- [Bento Metadatabase structure](https://github.com/CBIIT/bento-meta/blob/master/metamodel.svg)
- [Entity-State Model approach to versioning](<https://cbiit.github.io/bento-meta/model_versioning.html>)
