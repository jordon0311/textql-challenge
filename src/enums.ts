/**
 * A discriminator for the token type.
 */
export enum TokenType {
  STRING = "string",
  NUMBER = "number",
  OPERATOR = "operator",
}

/**
 * An enum containing the supported operators.
 */
export enum OperatorType {
  AND = "AND",
  OR = "OR",
  EQUAL = "=",
  NOT_EQUAL = "!=",
  GREATER_THAN = ">",
  LESS_THAN = "<",
  LEFT_PAREN = "(",
  RIGHT_PAREN = ")",
}
