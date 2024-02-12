import { TableRow, TableSchema } from "../types";

type Params = {
  selectedColumns: string[];
  schema: TableSchema;
  row: TableRow;
};

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
