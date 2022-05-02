# EVS-SIP GDC Data Loader (evs-sip-gdc-loader)

## About

This repository contains:

- Documentation that describes how to load data from [MDF](https://github.com/CBIIT/bento-mdf#model-description-files-mdf) files into Neo4j
- Functions to convert PCDC spreadsheets to MDF files
- Functions to load data from GDC YAML files (not MDF) into Neo4j

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
- MDF YAML files to import into Neo4j

### Import data files

The data extractor expects YAML files. Move the YAML files into a directory of your choice, such as `data/model`. Remember this directory for the next step, so that you specify it in the `.env` file.

### Assign environment variables

Make a copy of `.env.example`, and name the file `.env`. Then, replace the values of `.env` with values relevant to your deployment environment.

### Install Node.js packages

In a terminal, run the command `npm install`.

### Execute the code

In a terminal, run the command `npm run test [action type] [action]`. To see available action types and actions, run the command `npm run test`.

## Using Bento to Load Data

### Install the Bento MDF driver

On Windows, run the command

    pip install "bento-mdf@git+https://github.com/CBIIT/bento-mdf.git#egg=subdir&subdirectory=drivers/python"

On Linux and Mac(?), run the command

    pip install bento_mdf@git+https://github.com/CBIIT/bento-mdf.git#egg=subdir\&subdirectory=drivers/python

### Download the `gdc-model` repository

Clone the [CBIIT/gdc-model](https://github.com/CBIIT/gdc-model) repository.

### Load Data from MDF into Neo4j

Then, from `gdc-model/model-desc`, run

    load-mdf.py --handle GDC --user <user> --passw <passw> --bolt bolt://<host> --commit test --put gdc-model.yaml gdc-model-props.yaml model gdc-model-terms.yaml

## Project Structure

`index.js` is the ingress point for `src/main.js`.

`data` is a suggested directory for storing input files for this project.

`logs` contains logs.

`output` is the destination for files produced by this project.

`src/main.js` coordinates the execution of the user-specified actions.

`src/actionTypes` contains classes for each action type and functions for each action.

`src/lib` contains classes that represent graph nodes in the Bento MDB model. It also contains utility functions and a map of action type classes.

`src/mappings` contains files defining the YAML fields that match corresponding MDB fields. If the fieldset of a YAML file changes, then edit the corresponding mapping in `mappings` instead of editing the constructor of MDB classes in `lib`.

## Glossary

Below is a glossary of terminology used in this project's README and code:

| Term | Definition |
| ---- | ---------- |
| MDB node | Any node (whether it's labeled "property", "relationship", "node", etc.) in the MDB model |
| MDB Node | A node labeled "node" in the MDB model |
| MDB Property | A node labeled "property" in the MDB model |
| MDB Relationship | A node labeled "relationship" in the MDB model |
| MDF | Model Description Format - YAML files that represent nodes, relationships, node properties, and relationship properties |

## Learn More

- [Genomic Data Commons](<https://github.com/NCI-GDC/gdcdictionary>)
- [Pediatric Cancer Data Commons](https://evs.nci.nih.gov/ftp1/PCDC/About.html)
- [Bento Metadatabase structure](https://github.com/CBIIT/bento-meta/blob/master/metamodel.svg)
- [Bento Model Description Format](https://github.com/CBIIT/bento-mdf#model-description-files-mdf)
- [Bento GDC Model](https://github.com/CBIIT/gdc-model)
- [Entity-State Model approach to versioning](<https://cbiit.github.io/bento-meta/model_versioning.html>)
