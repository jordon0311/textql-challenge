import { OperatorType, TokenType } from "../enums";
import { Token } from "../types";

const operators = Object.values(OperatorType).map((v) => v as string);

export const tokenize = (input: string): Token[] => {
  const rawTokens = rawTokenize(input);

  const tokens = rawTokens.map<Token>((token) => {
    switch (true) {
      case operators.includes(token):
        return {
          type: TokenType.OPERATOR,
          value: token as OperatorType,
        };
      case token.startsWith('"'):
      case token.startsWith("'"):
        return {
          type: TokenType.STRING,
          value: token.slice(1, -1),
        };
      case !isNaN(parseFloat(token)):
        return {
          type: TokenType.NUMBER,
          value: parseFloat(token),
        };
      default:
        return {
          type: TokenType.STRING,
          value: token,
        };
    }
  });

  return tokens;
};

const rawTokenize = (input: string): string[] => {
  const stringOperators = ['"', "'"];

  const charArray = input.split("");

  const tokens: string[] = [];
  let currToken = "";

  /** This is just a small util for logging */
  const addToken = (token: string) => {
    // console.log({ added: token });
    tokens.push(token);
  };

  while (charArray.length > 0) {
    const char = charArray.shift();

    if (!char) {
      throw new Error("Unexpected end of input");
    }

    switch (true) {
      case char === " ":
        if (currToken) addToken(currToken);
        currToken = "";
        continue;
      case stringOperators.includes(char):
        let depth = 1;
        let thisToken = char;
        while (charArray.length > 0 && depth > 0) {
          const nextChar = charArray.shift();
          if (!nextChar) {
            throw new Error("Unexpected end of input");
          }
          if (nextChar === char) {
            thisToken += nextChar;
            depth--;
          }
          if (depth > 0) thisToken += nextChar;
        }
        addToken(thisToken);
        continue;
      case operators.includes(currToken + char):
        addToken(currToken + char);
        currToken = "";
        continue;
      case operators.includes(char):
        if (currToken) addToken(currToken);
        currToken = "";
        addToken(char);
        continue;
    }

    currToken += char;
  }

  if (currToken) addToken(currToken);

  return tokens;
};
