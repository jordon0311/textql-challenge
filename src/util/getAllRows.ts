import { ParsedData, ParsedTable } from "../types";

type Params = {
  parsedData: ParsedData;
  tableName: string;
};

export const getAllRows = (params: Params): ParsedTable | null => {
  const { parsedData, tableName } = params;
  const table = parsedData.find((t) => t.schema.tableName === tableName);
  return table || null;
};
