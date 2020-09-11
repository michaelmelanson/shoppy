
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
    const token = source.substr(position);

    function tryToken(rule) {
      var result = rule.exec(token);
      if (result !== null) {
        position += result[0].length;

        const newlines = [...result[0].matchAll(/\n/g)];
        line += newlines.length;

        if (newlines.length > 0) {
          col = 1 + (result[0].length - result[0].lastIndexOf('\n'));
        } else {
          col += result[0].length;
        }

        return result[0];
      }
    }

    if (match = tryToken(WHITESPACE)) {
      continue;
    } else if (match = tryToken(FUNCTION)) {
      tokens.push({type: 'function', location: {line, col}});
      continue;
    } else if (match = tryToken(RETURN)) {
      tokens.push({type: 'return' });
      continue;
    } else if (match = tryToken(IDENTIFIER)) {
      tokens.push({type: 'identifier', name: match });
      continue;
    } else if (match = tryToken(OPEN_PAREN)) {
      tokens.push({type: 'open-paren' });
      continue;
    } else if (match = tryToken(CLOSE_PAREN)) {
      tokens.push({type: 'close-paren' });
      continue;
    } else if (match = tryToken(OPEN_BRACE)) {
      tokens.push({type: 'open-brace' });
      continue;
    } else if (match = tryToken(CLOSE_BRACE)) {
      tokens.push({type: 'close-brace' });
      continue;
    } else if (match = tryToken(OPERATOR)) {
      tokens.push({type: 'operator', name: match });
      continue;
    } else if (match = tryToken(NUMBER_LITERAL)) {
      tokens.push({type: 'number-literal', value: parseInt(match) });
      continue;
    } else if (match = tryToken(END_OF_STATEMENT)) {
      tokens.push({type: 'end-of-statement' });
      continue;
    }

    console.log("Unexpected character:", token[0]);
    break;
  }

  tokens.push({type: 'end-of-file'});

  return tokens;
}

module.exports = {lexer};
