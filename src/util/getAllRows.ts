import { ParsedData, ParsedTable } from "../types";

type Params = {
  parsedData: ParsedData;
  tableName: string;
};

/**
 * Retrieves all rows from the parsed data for a specific table.
 * @param {Params} params - The parameters for retrieving the rows.
 * @param {ParsedData} params.parsedData - The parsed data containing multiple tables.
 * @param {string} params.tableName - The name of the table to retrieve rows from.
 * @returns {ParsedTable | null} - The retrieved table or null if not found.
 */
export const getAllRows = ({
  parsedData,
  tableName,
}: Params): ParsedTable | null => {
  const table = parsedData.find((t) => t.schema.tableName === tableName);
  return table || null;
};
