import { Statement } from "../ast";
import { lexer } from "../lexer";
import { ParseResult } from "../parse-utils";
import { parseStatement } from "../parser";

describe("parser", () => {
  describe("parseStatement", () => {
    it("parses a function call", () => {
      const result = parseStatement(lexer("print(1, 2, 3);"));

      expect(result).toEqual({
        value: {
          type: "function-call",
          functionName: "print",
          argumentList: [
            { type: "argument", value: { literal: { number: 1 } } },
            { type: "argument", value: { literal: { number: 2 } } },
            { type: "argument", value: { literal: { number: 3 } } },
          ],
          location: { line: 1, col: 1 },
        },
        rest: [{ type: "end-of-file", location: { line: 1, col: 16 } }],
      } as ParseResult<Statement>);
    });
  });
});
