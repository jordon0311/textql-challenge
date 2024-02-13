import { OperatorType, TokenType } from "../enums";
import {
  BinaryCondition,
  GroupCondition,
  Token,
  WhereCondition,
} from "../types";

/**
 * Parses an array of tokens representing a WHERE condition and returns the parsed condition.
 *
 * @param tokens - The array of tokens representing the WHERE condition.
 * @returns The parsed WHERE condition.
 */
export const parseWhereCondition = (tokens: Token[]): WhereCondition => {
  const stack: (WhereCondition | string | number)[] = [];
  const operatorStack: Token[] = [];

  tokens.forEach((token) => {
    switch (token.type) {
      case TokenType.OPERATOR:
        if (token.value === OperatorType.LEFT_PAREN) {
          operatorStack.push(token);
        } else if (token.value === OperatorType.RIGHT_PAREN) {
          while (
            operatorStack.length > 0 &&
            operatorStack[operatorStack.length - 1].value !==
              OperatorType.LEFT_PAREN
          ) {
            createBinaryConditionFromStack(stack, operatorStack);
          }
          operatorStack.pop(); // Pop the '('
        } else {
          while (canPop(operatorStack, token)) {
            createBinaryConditionFromStack(stack, operatorStack);
          }
          operatorStack.push(token);
        }
        break;
      case TokenType.STRING:
      case TokenType.NUMBER:
        // 'string' or 'number'
        stack.push(token.value);
        break;
    }
  });

  while (operatorStack.length > 0) {
    createBinaryConditionFromStack(stack, operatorStack);
  }

  return assertCondition(stack.pop());
};

/**
 * Determines whether an operator can be popped from the operator stack.
 * @param operatorStack - The operator stack.
 * @param operatorToken - The operator token to be checked.
 * @returns True if the operator can be popped, false otherwise.
 */
const canPop = (operatorStack: Token[], operatorToken: Token): boolean => {
  if (operatorStack.length === 0) return false;
  const peek = operatorStack[operatorStack.length - 1];
  if (peek.value === OperatorType.LEFT_PAREN) return false;
  const currentPrecedence = getPrecedence(operatorToken);
  const peekPrecedence = getPrecedence(peek);
  return currentPrecedence <= peekPrecedence;
};

/**
 * Returns the precedence value for the given operator token.
 * Higher precedence values indicate higher priority.
 * @param opToken - The operator token.
 * @returns The precedence value.
 */
const getPrecedence = (opToken: Token): number => {
  if (opToken.value === OperatorType.AND) return 2;
  if (opToken.value === OperatorType.OR) return 1;
  return 3; // '=', '!=', '<', '>', etc.
};

/**
 * Creates a binary condition from the stack and operator stack.
 * @param stack - The stack containing the operands and conditions.
 * @param operatorStack - The stack containing the operators.
 */
const createBinaryConditionFromStack = (
  stack: (WhereCondition | string | number)[],
  operatorStack: Token[]
) => {
  const right = stack.pop();
  const operator = operatorStack.pop();
  const left = stack.pop();

  const isLeftSimple = typeof left === "string";
  const isRightSimple = typeof right === "string" || typeof right === "number";

  const isLeftComplex = !!left && typeof left !== "string";
  const isRightComplex = !!right && typeof right !== "string";

  /**
   * I was hoping to use a switch here but TS can be picky
   * about type coercion with switches
   */
  if (operator) {
    if (isLeftSimple && isRightSimple) {
      const condition: BinaryCondition = {
        left,
        operator: assertOperatorType(operator.value),
        right,
        discriminator: "binary",
      };

      stack.push(condition);
      return;
    }
    if (isLeftComplex && isRightComplex) {
      const groupCondition: GroupCondition = {
        left: assertCondition(left),
        operator: assertGroupOperator(operator.value),
        right: assertCondition(right),
        discriminator: "group",
      };

      stack.push(groupCondition);
      return;
    }
  } else {
    console.error({ left, right, operator });
    throw new Error("Invalid expression");
  }
};

/**
 * Asserts the type of the operator value and returns the corresponding OperatorType.
 * @param value The value to be checked.
 * @returns The OperatorType corresponding to the value.
 * @throws Error if the value is not a string or if it is an invalid operator.
 */
const assertOperatorType = (value: string | number): OperatorType => {
  if (typeof value !== "string") {
    throw new Error("Operator must be a string");
  }
  const operatorType = Object.values(OperatorType).find((op) => op === value);
  if (!operatorType) {
    throw new Error(`Invalid operator: ${value}`);
  }
  return operatorType;
};

/**
 * Asserts that the given value is a valid group operator.
 * @param value - The value to be checked.
 * @returns The valid group operator.
 * @throws Error if the value is not a valid group operator.
 */
const assertGroupOperator = (
  value: string | number
): OperatorType.AND | OperatorType.OR => {
  switch (value) {
    case OperatorType.AND:
      return OperatorType.AND;
    case OperatorType.OR:
      return OperatorType.OR;
    default:
      throw new Error(`Expected: 'AND' | 'OR' , Recieved: ${value}`);
  }
};

/**
 * Asserts that the provided value is a valid WhereCondition.
 *
 * @param value - The value to be checked.
 * @returns The validated WhereCondition.
 * @throws Error if the value is a simple value (string or number) or undefined.
 */
const assertCondition = (
  value: string | number | WhereCondition | undefined
): WhereCondition => {
  switch (true) {
    case typeof value === "string":
    case typeof value === "number":
      throw new Error("Expected a condition, but recieved a simple value");
    case value === undefined:
      throw new Error("Expected a condition, but recieved undefined");
    default:
      return value;
  }
};
