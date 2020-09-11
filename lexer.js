
const WHITESPACE = /^\s/;
const FUNCTION = /^function/;
const RETURN = /^return/;
const IDENTIFIER = /^[a-zA-Z_]+/;
const OPEN_PAREN = /^\(/;
const CLOSE_PAREN = /^\)/;
const OPEN_BRACE = /^\{/;
const CLOSE_BRACE = /^\}/;
const OPERATOR = /^[+]/;
const NUMBER_LITERAL = /^\d+/;
const END_OF_STATEMENT = /^;/;

function lexer(source) {
  let line = 1;
  let col = 1;
  let position = 0;

  const tokens = [];

  while(position < source.length) {
    const text = source.substr(position);

    function tryToken(rule) {
      var result = rule.exec(text);
      if (result !== null) {
        const token = {match: result[0], location: {line, col}};

        position += result[0].length;

        const newlines = [...result[0].matchAll(/\n/g)];
        line += newlines.length;

        if (newlines.length > 0) {
          col = result[0].length - result[0].lastIndexOf('\n');
        } else {
          col += result[0].length;
        }

        return token;
      }
    }

    if (token = tryToken(WHITESPACE)) {
      continue;
    } else if (token = tryToken(FUNCTION)) {
      tokens.push({type: 'function', location: token.location});
      continue;
    } else if (token = tryToken(RETURN)) {
      tokens.push({type: 'return', location: token.location });
      continue;
    } else if (token = tryToken(IDENTIFIER)) {
      tokens.push({type: 'identifier', name: token.match, location: token.location });
      continue;
    } else if (token = tryToken(OPEN_PAREN)) {
      tokens.push({type: 'open-paren', location: token.location });
      continue;
    } else if (token = tryToken(CLOSE_PAREN)) {
      tokens.push({type: 'close-paren', location: token.location });
      continue;
    } else if (token = tryToken(OPEN_BRACE)) {
      tokens.push({type: 'open-brace', location: token.location });
      continue;
    } else if (token = tryToken(CLOSE_BRACE)) {
      tokens.push({type: 'close-brace', location: token.location });
      continue;
    } else if (token = tryToken(OPERATOR)) {
      tokens.push({type: 'operator', name: token.match, location: token.location });
      continue;
    } else if (token = tryToken(NUMBER_LITERAL)) {
      tokens.push({type: 'number-literal', value: parseInt(token.match), location: token.location });
      continue;
    } else if (token = tryToken(END_OF_STATEMENT)) {
      tokens.push({type: 'end-of-statement', location: token.location });
      continue;
    }

    console.log("Unexpected character:", text[0]);
    break;
  }

  tokens.push({type: 'end-of-file', location: {line, col}});

  return tokens;
}

module.exports = {lexer};
