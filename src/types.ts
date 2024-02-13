import { OperatorType, TokenType } from "./enums";

/** The raw object that is used as an input to parseData */
export type RawData = {
  [tableName: string]: TableRow[];
};

/**
 * Represents a row in a table with columns
 * that are restricted to a number or string value.
 */
export type TableRow = {
  [columnName: string]: string | number;
};

/**
 * Represents the schema of the json database table.
 */
export type TableSchema = {
  tableName: string;
  columns: ColumnSchema[];
};

/**
 * Represents the schema of a single table field.
 */
export type ColumnSchema = {
  columnName: string;
  columnType: "string" | "number";
};

/**
 * The parsed JSON data for a single table.
 */
export type ParsedTable = {
  schema: TableSchema;
  data: TableRow[];
};

/**
 * The parsed JSON data that is returned from parseData.
 */
export type ParsedData = ParsedTable[];

/**
 * The parsed query that is returned from parseQuery.
 */
export type ParsedQuery = {
  select: string[];
  from: string;
  whereStr?: string;
};

/**
 * A Token that represents a string value.
 */
export type StringToken = {
  type: TokenType.STRING;
  value: string;
};

/**
 * A Token that represents a number value.
 */
export type NumberToken = {
  type: TokenType.NUMBER;
  value: number;
};

/**
 * A Token that represents an operator.
 */
export type OperatorToken = {
  type: TokenType.OPERATOR;
  value: OperatorType;
};

/**
 * A union of the 3 token types that are returned by tokenization
 */
export type Token = StringToken | NumberToken | OperatorToken;

/**
 * A simple where condition (<, >, =, !=).
 */
export type BinaryCondition = {
  left: string;
  operator: OperatorType;
  right: string | number;
  discriminator: "binary";
};

/**
 * A group condition that can contain multiple conditions.
 */
export type GroupCondition = {
  left: BinaryCondition | GroupCondition;
  operator: OperatorType.AND | OperatorType.OR;
  right: BinaryCondition | GroupCondition;
  discriminator: "group";
};

/**
 * A union of the two condition types.
 */
export type WhereCondition = BinaryCondition | GroupCondition;
