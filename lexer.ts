import { Token, Operator } from "./types";

const WHITESPACE = /^\s/;
const FUNCTION = /^function/;
const RETURN = /^return/;
const IDENTIFIER = /^[a-zA-Z_]+/;
const OPEN_PAREN = /^\(/;
const CLOSE_PAREN = /^\)/;
const OPEN_BRACE = /^\{/;
const CLOSE_BRACE = /^\}/;
const COMMA = /^[,]/;
const OPERATOR = /^[+]/;
const NUMBER_LITERAL = /^\d+/;
const END_OF_STATEMENT = /^;/;

export function lexer(source: string) {
  let line = 1;
  let col = 1;
  let position = 0;

  const tokens: Token[] = [];

  while (position < source.length) {
    const text = source.substr(position);

    function tryToken(rule: RegExp) {
      var result = rule.exec(text);
      if (result !== null) {
        const match = { text: result[0], location: { line, col } };

        position += result[0].length;

        const newlines = [...result[0].matchAll(/\n/g)];
        line += newlines.length;

        if (newlines.length > 0) {
          col = result[0].length - result[0].lastIndexOf("\n");
        } else {
          col += result[0].length;
        }

        return match;
      }
    }

    let match;
    if ((match = tryToken(WHITESPACE))) {
      continue;
    } else if ((match = tryToken(FUNCTION))) {
      tokens.push({ type: "function", location: match.location });
      continue;
    } else if ((match = tryToken(RETURN))) {
      tokens.push({ type: "return", location: match.location });
      continue;
    } else if ((match = tryToken(IDENTIFIER))) {
      tokens.push({
        type: "identifier",
        name: match.text,
        location: match.location,
      });
      continue;
    } else if ((match = tryToken(OPEN_PAREN))) {
      tokens.push({ type: "open-paren", location: match.location });
      continue;
    } else if ((match = tryToken(CLOSE_PAREN))) {
      tokens.push({ type: "close-paren", location: match.location });
      continue;
    } else if ((match = tryToken(OPEN_BRACE))) {
      tokens.push({ type: "open-brace", location: match.location });
      continue;
    } else if ((match = tryToken(CLOSE_BRACE))) {
      tokens.push({ type: "close-brace", location: match.location });
      continue;
    } else if ((match = tryToken(COMMA))) {
      tokens.push({ type: "comma", location: match.location });
      continue;
    } else if ((match = tryToken(OPERATOR))) {
      tokens.push({
        type: "operator",
        op: match.text as Operator,
        location: match.location,
      });
      continue;
    } else if ((match = tryToken(NUMBER_LITERAL))) {
      tokens.push({
        type: "number-literal",
        value: parseInt(match.text),
        location: match.location,
      });
      continue;
    } else if ((match = tryToken(END_OF_STATEMENT))) {
      tokens.push({ type: "end-of-statement", location: match.location });
      continue;
    }

    console.log("Unexpected character:", text[0]);
    break;
  }

  tokens.push({ type: "end-of-file", location: { line, col } });

  return tokens;
}
