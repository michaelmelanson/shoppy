export type Identifier = string;

export enum Operator {
  Plus = "+",
}

export interface TokenLocation {
  line: number;
  col: number;
}

export type FunctionToken = { type: "function" };
export type ReturnToken = { type: "return" };
export type IdentifierToken = { type: "identifier"; name: Identifier };
export type OpenParenToken = { type: "open-paren" };
export type CloseParenToken = { type: "close-paren" };
export type OpenBraceToken = { type: "open-brace" };
export type CloseBraceToken = { type: "close-brace" };
export type CommaToken = { type: "comma" };
export type OperatorToken = { type: "operator"; op: Operator };
export type NumberLiteralToken = { type: "number-literal"; value: number };
export type EndOfStatementToken = { type: "end-of-statement" };
export type EndOfFileToken = { type: "end-of-file" };

export type Token = (
  | FunctionToken
  | ReturnToken
  | IdentifierToken
  | OpenParenToken
  | CloseParenToken
  | OpenBraceToken
  | CloseBraceToken
  | CommaToken
  | OperatorToken
  | NumberLiteralToken
  | EndOfStatementToken
  | EndOfFileToken
) & {
  location: TokenLocation;
};
