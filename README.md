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

Classes that represent nodes in the Bento MDB model are found in the `lib` directory.

## Learn More

- [Bento Metadatabase structure](https://github.com/CBIIT/bento-meta/blob/master/metamodel.svg)
- [Entity-State Model approach to versioning](<https://cbiit.github.io/bento-meta/model_versioning.html>)