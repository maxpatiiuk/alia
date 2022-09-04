import type { RA } from '../utils/types.js';
import { split } from '../utils/utils.js';
import {
  endMatcher,
  idMatcher,
  intLiteralMatcher,
  stringLiteralMatcher,
} from './matchers.js';
import type { Tokens } from './tokens.js';
import type { MatcherResult } from './types.js';

const tokenDefinitions: {
  readonly [T in keyof Tokens]:
    | string
    | ((input: string) => MatcherResult<T> | undefined);
} = {
  AND: 'and',
  ARROW: '->',
  ASSIGN: '=',
  BOOL: 'bool',
  COMMA: ',',
  DIVIDE: '/',
  ELSE: 'else',
  END: endMatcher,
  EQUALS: '==',
  FALSE: 'false',
  FN: 'fn',
  FOR: 'for',
  GREATER: '>',
  GREATEREQ: '>=',
  ID: idMatcher,
  IF: 'if',
  INPUT: 'input',
  INT: 'int',
  INTLITERAL: intLiteralMatcher,
  LCURLY: '{',
  LESS: '<',
  LESSEQ: '<=',
  LPAREN: '(',
  MINUS: '-',
  MAYHEM: 'mayhem',
  NOT: '!',
  NOTEQUALS: '!=',
  OR: 'or',
  OUTPUT: 'output',
  PLUS: '+',
  POSTDEC: '--',
  POSTINC: '++',
  RETURN: 'return',
  RCURLY: '}',
  RPAREN: ')',
  SEMICOL: ';',
  STRINGLITERAL: stringLiteralMatcher,
  TIMES: '*',
  TRUE: 'true',
  VOID: 'void',
  WHILE: 'while',
};

export const isToken = (token: string): token is keyof Tokens =>
  token in tokenDefinitions;

const [rawSimpleTokens, rawComplexTokens] = split(
  Object.entries(tokenDefinitions),
  ([_type, matcher]) => typeof matcher === 'function'
);
export const simpleTokens = rawSimpleTokens as RA<
  readonly [keyof Tokens, string]
>;
export const complexTokens = rawComplexTokens as RA<
  readonly [
    keyof Tokens,
    (input: string) => MatcherResult<keyof Tokens> | undefined
  ]
>;

const lowerCaseKey = Object.keys(tokenDefinitions).find((key) =>
  key.startsWith(key[0].toLowerCase())
);
if (typeof lowerCaseKey === 'string')
  throw new Error(`Token names must be capitalized. Found: ${lowerCaseKey}`);
