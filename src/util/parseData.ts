import { ParsedData, ParsedTable, TableRow, TableSchema } from "../types";

/**
 * Parses the given data and returns an array of parsed tables.
 * @param data The data to be parsed.
 * @returns An array of parsed tables.
 */
export const parseData = (data: unknown): ParsedData => {
  const dataObj = assertObject("data", data);

  /**
   * Parses the data object into an array of ParsedTable objects.
   * @param dataObj - The data object to be parsed.
   * @returns An array of ParsedTable objects containing the schema and validated rows.
   */
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

/**
 * Asserts that the input is an object and returns it.
 * Throws an error if the input is falsey, not an object, or an array.
 *
 * @param label - The label for the input value.
 * @param input - The input value to be asserted.
 * @returns The input value if it is an object.
 * @throws Error if the input is falsey, not an object, or an array.
 */
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

/**
 * Asserts that the input is an array.
 * @param label - The label for the input.
 * @param input - The input to be checked.
 * @returns The input as an array.
 * @throws Error if the input is not an array.
 */
const assertArray = (label: string, input: unknown): unknown[] => {
  if (!Array.isArray(input)) {
    throw new Error(`${label} must be an array`);
  }
  return input;
};

/**
 * Retrieves the table schema for a given table name and unverified row.
 *
 * @param tableName - The name of the table.
 * @param unverifiedRow - The unverified row data.
 * @returns The table schema containing the table name and column schema array.
 * @throws Error if any column in the row is not a string or a number.
 */
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

/**
 * Validates the rows of data against the given table schema.
 *
 * @param schema - The table schema to validate against.
 * @param unverifiedRows - The array of unverified rows to be validated.
 * @returns An array of validated table rows.
 * @throws Error if a column in a row does not exist in the schema or if the value of a column does not match its expected type.
 */
const validateRows = (
  schema: TableSchema,
  unverifiedRows: unknown[]
): TableRow[] => {
  const rows = unverifiedRows.map((row, index) => {
    return assertObject(`row ${index} of ${schema.tableName}`, row);
  });

  /**
   * Validates the rows of data by checking if each column exists in the schema and if the value matches the expected type.
   * Throws an error if a column does not exist or if the value has an incorrect type.
   *
   * @param rows - The rows of data to be validated.
   * @param schema - The schema containing the column definitions.
   * @returns An array of validated rows.
   */
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
