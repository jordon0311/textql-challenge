import { OperatorType } from "../enums";
import {
  BinaryCondition,
  GroupCondition,
  ParsedTable,
  TableRow,
  WhereCondition,
} from "../types";

type Params = {
  parsedTable: ParsedTable;
  where: WhereCondition;
};

/**
 * Executes the WHERE condition on a parsed table and returns the filtered data.
 * @param params.parsedTable - The table that we are executing the condition on.
 * @param params.where - The WHERE condition to be executed.
 * @returns The parsed table with the filtered data.
 */
export const executeWhereCondition = (params: Params): ParsedTable => {
  const { parsedTable, where } = params;
  const filteredData = parsedTable.data.filter((row) => {
    const result = executeCondition(row, where);
    return !!result;
  });
  return { schema: parsedTable.schema, data: filteredData };
};

/**
 * We return the row if the condition is true, otherwise null
 * Currently the result is just used to filter so it just needs to be truthy
 * but maybe we will transform in the future so I left it as a TableRow
 */
const executeCondition = (
  row: TableRow,
  where: WhereCondition
): TableRow | null => {
  switch (where.discriminator) {
    case "binary":
      return executeBinaryCondition(row, where);
    case "group":
      return executeGroupCondition(row, where);
  }
};

/**
 * Executes a binary condition on a given row of data.
 * @param row The row of data to evaluate the condition on.
 * @param condition The binary condition to evaluate.
 * @returns The row if the condition is true, otherwise null.
 * @throws Error if the left side of the condition is not a column key or if an invalid operator is used.
 */
const executeBinaryCondition = (
  row: TableRow,
  condition: BinaryCondition
): TableRow | null => {
  const leftIsColKey = row.hasOwnProperty(condition.left);
  if (!leftIsColKey) {
    throw new Error(
      `The left side of a binary condition (${condition.left}) must be a column key`
    );
  }
  /** Get the column value */
  const left = row[condition.left];

  const { operator, right } = condition;
  switch (operator) {
    case OperatorType.EQUAL:
      return left === right ? row : null;
    case OperatorType.NOT_EQUAL:
      return left !== right ? row : null;
    case OperatorType.GREATER_THAN:
      return left > right ? row : null;
    case OperatorType.LESS_THAN:
      return left < right ? row : null;
    default:
      throw new Error(`Invalid operator for binary condition: ${operator}`);
  }
};

/**
 * Executes a group condition on a given row.
 * @param row The row to evaluate the condition on.
 * @param condition The group condition to execute.
 * @returns The row if the condition is satisfied, otherwise null.
 * @throws Error if an invalid operator is used in the group condition.
 */
const executeGroupCondition = (
  row: TableRow,
  condition: GroupCondition
): TableRow | null => {
  const leftResult = executeCondition(row, condition.left);
  const rightResult = executeCondition(row, condition.right);
  if (condition.operator === OperatorType.AND) {
    return leftResult && rightResult ? row : null;
  }
  if (condition.operator === OperatorType.OR) {
    return leftResult || rightResult ? row : null;
  }
  throw new Error(
    `Invalid operator for group condition: ${condition.operator}`
  );
};
