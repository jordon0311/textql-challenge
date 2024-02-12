import { ParsedData, ParsedTable } from "../types";

type Params = {
  parsedData: ParsedData;
  tableName: string;
};

export const getAllRows = (params: Params): ParsedTable | null => {
  throw new Error("Not implemented");
};
