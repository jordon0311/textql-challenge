import { ParsedData, ParsedTable, TableRow, TableSchema } from "../types";

export const parseData = (data: unknown): ParsedData => {
  const dataObj = assertObject("data", data);

  const parsedTables: ParsedTable[] = Object.entries(dataObj).map(
    ([tableName, rows]) => {
      const unvalidatedRows = assertArray(`value of ${tableName}`, rows);
      const firstRow = unvalidatedRows[0];
      const schema = getTableSchema(tableName, firstRow);

      const validatedRows = validateRows(schema, unvalidatedRows);

      return { schema, data: validatedRows };
    }
  );

  return parsedTables;
};

const assertObject = (label: string, input: unknown): Record<string, any> => {
  switch (true) {
    case !input:
      throw new Error(`${label} cannot be falsey`);
    case typeof input !== "object":
      throw new Error(`${label} must be an object`);
    case Array.isArray(input):
      throw new Error(`${label} cannot be an array`);
    default:
      return input;
  }
};

const assertArray = (label: string, input: unknown): unknown[] => {
  if (!Array.isArray(input)) {
    throw new Error(`${label} must be an array`);
  }
  return input;
};

const getTableSchema = (
  tableName: string,
  unverifiedRow: unknown
): TableSchema => {
  const row = assertObject(`first row of ${tableName}`, unverifiedRow);
  const columnSchemaArr = Object.entries(row).map(([columnName, value]) => {
    const columnType = typeof value;
    if (columnType !== "string" && columnType !== "number") {
      throw new Error(`Expected ${columnName} be a string or a number`);
    }

    return { columnName, columnType };
  });
  return { tableName, columns: columnSchemaArr };
};

const validateRows = (
  schema: TableSchema,
  unverifiedRows: unknown[]
): TableRow[] => {
  const rows = unverifiedRows.map((row, index) => {
    return assertObject(`row ${index} of ${schema.tableName}`, row);
  });

  const validatedRows = rows.map((row, i) => {
    const entries: [string, string | number][] = Object.entries(row).map(
      ([columnName, value]) => {
        const columnSchema = schema.columns.find(
          (col) => col.columnName === columnName
        );
        if (!columnSchema) {
          throw new Error(
            `Column ${columnName} does not exist in ${schema.tableName}`
          );
        }
        if (typeof value !== columnSchema.columnType) {
          throw new Error(
            `Expected ${columnName} to be of type ${columnSchema.columnType} in ${schema.tableName} row ${i}`
          );
        }
        return [columnName, value as string | number];
      }
    );

    const validatedRow = Object.fromEntries(entries);

    return validatedRow;
  });

  return validatedRows;
};
