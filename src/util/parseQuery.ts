import { ParsedQuery } from "../types";

/**
 * Parses the given query string and extracts the select columns, table name, and optional WHERE condition.
 * The query must be in the format 'SELECT [columns] FROM [table] {optional: WHERE [condition]};'
 * @param query The query string to parse.
 * @returns An object containing the parsed select columns, table name, and optional WHERE condition.
 * @throws Error if the query is not in the correct format or if it does not end with a semicolon.
 */
export const parseQuery = (query: string): ParsedQuery => {
  /**
   * This regex is magic and I made it all by myself
   * thanks to: https://regex101.com/
   */
  const regex =
    /\s*(SELECT\s+)?(.+?)(\s+FROM\s+)(\w+)(\s+WHERE\s+(.+?)(?=;|$))?(;)?/gm;
  const match = regex.exec(query);

  if (!match) {
    throw new Error(
      "Query must be in format 'SELECT [columns] FROM [table] {optional: WHERE [condition]};'"
    );
  }

  if (!match[7]) {
    throw new Error("Query must end with a semicolon");
  }

  const select = match[2].split(",").map((s) => s.trim());
  const from = match[4];
  const whereStr = match[6];

  return { select, from, whereStr };
};
