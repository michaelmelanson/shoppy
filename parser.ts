import { Argument, Literal, Statement, Value } from "./ast";
import {
  consumeToken,
  isParseError,
  ParseError,
  ParseResult,
  sequence,
  tryParse,
} from "./parse-utils";
import {
  CloseParenToken,
  CommaToken,
  EndOfStatementToken,
  Identifier,
  IdentifierToken,
  NumberLiteralToken,
  OpenParenToken,
  Token,
} from "./types";

export function parseNumberLiteral(tokens: Token[]): ParseResult<Literal> {
  const { token, rest } = consumeToken<NumberLiteralToken>(
    tokens,
    "number-literal"
  );
  return {
    value: { number: token.value },
    rest,
  };
}

export function parseIdentifier(tokens: Token[]): ParseResult<Identifier> {
  const { token, rest } = consumeToken<IdentifierToken>(tokens, "identifier");
  return {
    value: token.name,
    rest,
  };
}

export function parseValue(tokens: Token[]): ParseResult<Value> {
  // try parsing an identifier
  const identifierResult = tryParse(parseIdentifier, tokens);

  if (!isParseError(identifierResult)) {
    return {
      value: { identifier: identifierResult.value },
      rest: identifierResult.rest,
    };
  }

  // try parsing a number literal
  const numberResult = tryParse(parseNumberLiteral, tokens);

  if (!isParseError(numberResult)) {
    return {
      value: { literal: { number: numberResult.value.number } },
      rest: numberResult.rest,
    };
  }

  // throw a parse error
  throw {
    expected: "identifier or number",
    actual: tokens[0],
  } as ParseError;
}

export function parseArgument(tokens: Token[]): ParseResult<Argument> {
  const { value, rest } = parseValue(tokens);

  return {
    value: {
      type: "argument",
      value: value,
    },
    rest,
  };
}

export function parseComma(tokens: Token[]): ParseResult<{}> {
  const { rest } = consumeToken<CommaToken>(tokens, "comma");
  return {
    value: {},
    rest,
  };
}

export function parseArgumentList(tokens: Token[]): ParseResult<Argument[]> {
  return sequence<Argument>(parseArgument, parseComma, tokens);
}

export function parseStatement(tokens: Token[]): ParseResult<Statement> {
  // expect an identifier
  const { token: identifierToken, rest: restAfterIdentifer } = consumeToken<
    IdentifierToken
  >(tokens, "identifier");

  // expect an open paren
  const { rest: restAfterOpenParen } = consumeToken<OpenParenToken>(
    restAfterIdentifer,
    "open-paren"
  );

  // expect an argument list
  const {
    value: argumentList,
    rest: restAfterArgumentList,
  } = parseArgumentList(restAfterOpenParen);

  // expect a close paren
  const { rest: restAfterCloseParen } = consumeToken<CloseParenToken>(
    restAfterArgumentList,
    "close-paren"
  );

  // expect an end of statement (semicolon)
  const { rest: restAfterEndOfStatement } = consumeToken<EndOfStatementToken>(
    restAfterCloseParen,
    "end-of-statement"
  );

  return {
    value: {
      type: "function-call",
      functionName: identifierToken.name,
      argumentList,
      location: tokens[0].location,
    },
    rest: restAfterEndOfStatement,
  };
}
