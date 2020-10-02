import { Identifier, TokenLocation } from "./types";

export type Literal = { number: number };
export type Value = { identifier: Identifier } | { literal: Literal };

export type FunctionCallStatement = {
  type: "function-call";
  functionName: Identifier;
  argumentList: Argument[];
  location: TokenLocation;
};

export type Statement = FunctionCallStatement;

export type Argument = { type: "argument"; value: Value };
