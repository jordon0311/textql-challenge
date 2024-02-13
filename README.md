# Simple SQL parser for JSON data

## Description

This repository contains a simple SQL parser designed to parse and query JSON data. It provides a convenient way to extract and manipulate data from JSON files using SQL-like syntax. The parser supports basic SQL operations such as SELECT, FROM and WHERE, allowing users to filter and sort JSON data based on specific criteria.

## Requirements

Check the [CHALLENGE](./CHALLENGE.md) to see what this was built to be able to do.

## Installation

Below are the installation instructions for various operating systems

### MacOS

1. Make sure your MacOS version is up-to-date
1. Get the other Mac Software tooling

    ```bash
    softwareupdate --all --install --force
    ```  

1. Install homebrew

    ```bash
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    ```

1. Check that brew is working

    ```bash
    brew doctor
    ```

1. Update brew

    ```bash
    brew update
    ```

1. Make sure `node` is installed

    ```bash
    brew install node
    ```

1. Install `nvm` to make sure that you are using the right version

    ```bash
    brew install nvm
    ```

1. For here out, make sure that you are `cd` into the repo
1. Use the node version provided in `.nvmrc`

    ```bash
    nvm use
    ```

1. Install the required node modules

    ```bash
    npm i
    ```

### Linux

1. Follow the steps for MacOS and hope it works

### Windows

1. Cry because your operating system is not supported

## Usage

1. Test that the source code is working correctly

    ```bash
    npm run test
    ```

1. Build the repo

    ```bash
    npm run build
    ```

1. Start the SQL parser

    ```bash
    npm run start
    ```

1. Enter a query that applies to the data.json file (currently the only supported table is `user`)

    ```sql
     SELECT  "firstName","lastName", "age", "eyeColor"  FROM  user  WHERE  ("eyeColor" = "blue" AND gender != "female") OR ("eyeColor" = "blue" AND gender != "male");
    ```

1. If you want to get an error then type something in that is wrong

    ```sql
     SELECT  "first Name","lastName", "age", "eyeColor"  FROM  user  WHERE  ("eyeColor" = "blue" AND gender != "female") OR ("eyeColor" = "blue" AND gender != "male");
    ```

## Examples

`src/constants/testQueries.ts` has some example queries that are used for testing. This is far from comprehensive, but will give you a good idea of what can be done.

## Limitations

Check the [CHALLENGE](./CHALLENGE.md) to see what this was built to be able to do. It does nothing more than listed in there.
