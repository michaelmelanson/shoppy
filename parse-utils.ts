import { Token } from "./types";

export type ParseError = { expected: string; actual: Token };
export function isParseError(exception: any): exception is ParseError {
  if (typeof exception.expected !== "string") {
    return false;
  }

  return true;
}

export type ParseResult<T> = { value: T; rest: Token[] };

export type Parser<T> = (tokens: Token[]) => ParseResult<T>;

export function tryParse<T>(
  parser: Parser<T>,
  tokens: Token[]
): ParseResult<T> | ParseError {
  try {
    return parser(tokens);
  } catch (error) {
    if (isParseError(error)) {
      return error;
    } else {
      throw error;
    }
  }
}

export function consumeToken<TokenType extends { type: string }>(
  tokens: Token[],
  tokenType: TokenType["type"]
): { token: TokenType; rest: Token[] } {
  const token: Token = tokens[0];

  if (token.type !== tokenType) {
    throw { expected: tokenType, actual: token } as ParseError;
  }

  return {
    token: (token as unknown) as TokenType,
    rest: tokens.slice(1),
  };
}

export function sequence<T>(
  valueParser: Parser<T>,
  separatorParser: Parser<{}>,
  tokens: Token[]
): ParseResult<T[]> {
  const value: T[] = [];
  let rest = tokens;

  while (true) {
    const result = tryParse(valueParser, rest);

    if (isParseError(result)) {
      throw result;
    }

    value.push(result.value);
    rest = result.rest;

    const separatorResult = tryParse(separatorParser, rest);
    if (isParseError(separatorResult)) {
      break;
    }

    rest = separatorResult.rest;
  }

  return {
    value,
    rest,
  };
}
