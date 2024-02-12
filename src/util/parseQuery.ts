import { ParsedQuery } from "../types";

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
