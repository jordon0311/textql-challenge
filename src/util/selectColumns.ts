import { TableRow, TableSchema } from "../types";

export type Params = {
  selectedColumns: string[];
  schema: TableSchema;
  row: TableRow;
};

export const selectColumns = (params: Params): TableRow => {
  throw new Error("Not implemented");
};
