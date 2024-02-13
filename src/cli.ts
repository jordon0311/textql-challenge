import * as readline from "readline";
import {
  ParsedData,
  ParsedQuery,
  ParsedTable,
  Token,
  WhereCondition,
} from "./types";
import { executeWhereCondition } from "./util/executeWhereCondition";
import { getAllRows } from "./util/getAllRows";
import { parseQuery } from "./util/parseQuery";
import { parseWhereCondition } from "./util/parseWhereCondition";
import { selectColumns } from "./util/selectColumns";
import { tokenize } from "./util/tokenize";

export const commandLineInterface = (parsedData: ParsedData) => {
  /** Command Line Interface */
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("Enter your SQL query: ", (query) => {
    try {
      /** Parse the query */
      const parsedQuery: ParsedQuery = parseQuery(query);

      /**
       * Get all the rows for the selected table
       */
      const allRows: ParsedTable | null = getAllRows({
        parsedData,
        tableName: parsedQuery.from,
      });

      if (!allRows) {
        console.error(`Table ${parsedQuery.from} not found`);
        rl.close();
        return;
      }

      /** Handle the potential where condition */
      const filteredRows: ParsedTable = (() => {
        /** Return allRows if there is no WHERE condition */
        if (!parsedQuery.whereStr) {
          return allRows;
        }

        /** Tokenize the WHERE string */
        const tokens: Token[] = tokenize(parsedQuery.whereStr);

        /** Convert the tokens into a WhereCondition */
        const where: WhereCondition = parseWhereCondition(tokens);

        /** Execute the WhereCondition to filter the TableRows */
        const result: ParsedTable = executeWhereCondition({
          parsedTable: allRows,
          where,
        });

        /** Return the filtered rows */
        return result;
      })();

      /** Select the desired columns from the filtered rows */
      const { schema, data } = filteredRows;
      /**
       * Data Transfer Object (DTO) for filteredRows
       * This contains only the selected columns
       */
      const rowDtos = data.map((row) => {
        const dto = selectColumns({
          selectedColumns: parsedQuery.select,
          schema,
          row,
        });

        return dto;
      });

      /** Return the DTOs */
      const json = JSON.stringify(rowDtos, null, 2);
      console.info("\nRESULTS:\n", json);

      rl.close();
    } catch (error) {
      console.error(error);
      rl.close();
    }
  });
};
