import type { State } from 'typesafe-reducer';

import type { RA } from '../utils/types.js';
import type { Tokens } from './tokens.js';

export type Token<TERMINAL extends keyof Tokens = keyof Tokens> = {
  readonly type: TERMINAL;
  readonly data: Tokens[TERMINAL];
  readonly simplePosition: number;
};

export type Position = {
  readonly lineNumber: number;
  readonly columnNumber: number;
};

export type MatcherResult<T extends keyof Tokens> = {
  readonly type: T | undefined;
  readonly data: Tokens[T] | undefined;
  readonly tokenLength: number;
  readonly syntaxErrors: RA<SyntaxError>;
};

export type SyntaxError = State<
  'SyntaxError',
  {
    readonly start: number;
    readonly end: number;
    readonly message: string;
  }
>;
