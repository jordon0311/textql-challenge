import { OperatorType, TokenType } from "./enums";

export type RawData = {
  [tableName: string]: TableRow[];
};

export type TableRow = {
  [columnName: string]: string | number;
};

export type TableSchema = {
  tableName: string;
  columns: ColumnSchema[];
};

export type ColumnSchema = {
  columnName: string;
  columnType: "string" | "number";
};

export type ParsedTable = {
  schema: TableSchema;
  data: TableRow[];
};

export type ParsedData = ParsedTable[];

export type ParsedQuery = {
  select: string[];
  from: string;
  whereStr?: string;
};

export type StringToken = {
  type: TokenType.STRING;
  value: string;
};

export type NumberToken = {
  type: TokenType.NUMBER;
  value: number;
};

export type OperatorToken = {
  type: TokenType.OPERATOR;
  value: OperatorType;
};

export type Token = StringToken | NumberToken | OperatorToken;

export type BinaryCondition = {
  left: string;
  operator: OperatorType;
  right: string | number;
  discriminator: "binary";
};

export type GroupCondition = {
  left: BinaryCondition | GroupCondition;
  operator: OperatorType.AND | OperatorType.OR;
  right: BinaryCondition | GroupCondition;
  discriminator: "group";
};

export type WhereCondition = BinaryCondition | GroupCondition;
