import { ParsedTable, WhereCondition } from "../types";

type Params = {
  parsedTable: ParsedTable;
  where: WhereCondition;
};

export const executeWhereCondition = (params: Params): ParsedTable => {
  throw new Error("Not implemented");
};
