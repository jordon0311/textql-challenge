import * as fs from "fs";
import { commandLineInterface } from "./cli";
import { ParsedData } from "./types";
import { parseData } from "./util/parseData";

const main = async () => {
  // Read the data from data.json
  const fileContent = fs.readFileSync("data.json", "utf8");
  // Parse the data from JSON
  const jsonData = JSON.parse(fileContent);

  /**
   * I'm doing this because I originally planned of supporting
   * multiple tables, but I realized that it's not a part
   * of the challenge. I'm leaving it here for future me.
   */
  const tables = { user: jsonData };

  /** transform the json into my type */
  const parsedData: ParsedData = parseData(tables);

  /**
   * Command Line Interface to accept SQL query
   */
  commandLineInterface(parsedData);
};

main();
