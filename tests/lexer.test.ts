import {lexer} from '../lexer';

describe('lexer', () => {
  it('should process a function definition', () => {
    const tokens = lexer("\n\
function addOne(x) {\n\
  return x + 1;\n\
}");

    expect(tokens).toEqual([
      {type: 'function', location: { line: 2, col: 1 }},
      {type: 'identifier', name: 'addOne', location: { line: 2, col: 10 } },
      {type: 'open-paren', location: { line: 2, col: 16 }},
      {type: 'identifier', name: 'x', location: { line: 2, col: 17 } },
      {type: 'close-paren', location: { line: 2, col: 18 }},
    
      {type: 'open-brace', location: { line: 2, col: 20 }},
      {type: 'return', location: { line: 3, col: 3 }},
      {type: 'identifier', name: 'x', location: { line: 3, col: 10 } },
      {type: 'operator', op: '+', location: { line: 3, col: 12 } },
      {type: 'number-literal', value: 1, location: { line: 3, col: 14 } },
      {type: 'end-of-statement', location: { line: 3, col: 15 } },
      {type: 'close-brace', location: { line: 4, col: 1 }},
      {type: 'end-of-file', location: { line: 4, col: 2 }}
    ]);
  });

  it('should process a print statement', () => {
    const tokens = lexer("\n\
print(addOne(3) + 2);\n\
");

    expect(tokens).toEqual([
      {type: 'identifier', name: 'print', location: { line: 2, col: 1}},
      {type: 'open-paren', location: { line: 2, col: 6}},
      {type: 'identifier', name: 'addOne', location: { line: 2, col: 7}},
      {type: 'open-paren', location: { line: 2, col: 13}},
      {type: 'number-literal', value: 3, location: { line: 2, col: 14 }},
      {type: 'close-paren', location: { line: 2, col: 15}},
      {type: 'operator', op: '+', location: { line: 2, col: 17 } },
      {type: 'number-literal', value: 2, location: { line: 2, col: 19 }},
      {type: 'close-paren', location: { line: 2, col: 20 }},
      {type: 'end-of-statement', location: { line: 2, col: 21 } },
      {type: 'end-of-file', location: { line: 3, col: 1 }}
    ]);
  });
});