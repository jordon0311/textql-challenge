import * as fs from "fs";
import * as readline from "readline";

const main = async () => {
  // Read the data from data.json
  const fileContent = fs.readFileSync("data.json", "utf8");
  // Parse the data from JSON
  const jsonData = JSON.parse(fileContent);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("Enter your SQL query: ", (query) => {
    console.log({ query });

    rl.close();
  });
};

main();
