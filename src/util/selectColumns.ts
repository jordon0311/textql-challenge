import { TableRow, TableSchema } from "../types";

type Params = {
  selectedColumns: string[];
  schema: TableSchema;
  row: TableRow;
};

/**
 * Selects specific columns from a table row based on the provided parameters.
 * If the selected columns include "*", the entire row is returned.
 * If any selected column does not exist in the row, an error is thrown.
 *
 * @param params - The parameters for selecting columns.
 * @returns The filtered row containing only the selected columns.
 * @throws Error if selectedColumns is empty or if any selected column does not exist in the row.
 */
export const selectColumns = (params: Params): TableRow => {
  const { schema, row } = params;
  const selectedColumns = params.selectedColumns.map(trimColName);
  if (selectedColumns.length === 0) {
    throw new Error("selectedColumns must not be empty");
  }
  if (selectedColumns.includes("*")) {
    return row;
  }
  const filteredRow: TableRow = {};
  selectedColumns.forEach((col) => {
    const value = row[col];
    if (value === undefined) {
      console.log({ row });
      throw new Error(`Column ${col} does not exist in ${schema.tableName}`);
    }
    filteredRow[col] = value;
  });
  return filteredRow;
};

/** Remove any quotations from the column key */
export const trimColName = (col: string) => col.replace(/\"|\'/gm, "").trim();
