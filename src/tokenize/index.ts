/**
 * Try to convert input source code into tokens, until failure or end of input
 */

import type { RA } from '../utils/types.js';
import { mappedFind } from '../utils/utils.js';
import { complexTokens, simpleTokens } from './definitions.js';
import {
  commentMatcher,
  defaultMatcher,
  whitespaceMatcher,
} from './matchers.js';
import type { Tokens } from './tokens.js';
import type { MatcherResult, Position, SyntaxError, Token } from './types.js';

export function tokenize(
  input: string,
  positionOffset: number,
  positionResolver: (position: number) => Position
): {
  readonly tokens: RA<Token>;
  readonly syntaxErrors: RA<SyntaxError>;
} {
  const { type, data, tokenLength, syntaxErrors } =
    commentMatcher(input) ??
    mappedFind(simpleTokens, ([type, matcher]) =>
      defaultMatcher(type, matcher, input)
    ) ??
    mappedFind(complexTokens, ([_type, matcher]) => matcher(input)) ??
    whitespaceMatcher(input) ??
    invalidToken(input);

  const remainingInput = input.slice(tokenLength);
  const { tokens, syntaxErrors: additionalErrors } =
    type === 'END'
      ? {
          tokens: [],
          syntaxErrors: [],
        }
      : tokenize(
          remainingInput,
          positionOffset + tokenLength,
          positionResolver
        );

  const token: Token | undefined =
    typeof data === 'object' && typeof type === 'string'
      ? {
          type,
          data,
          position: positionResolver(positionOffset),
        }
      : undefined;

  return {
    tokens: [...(typeof token === 'object' ? [token] : []), ...tokens],
    syntaxErrors: [
      ...repositionErrors(syntaxErrors, positionOffset),
      ...additionalErrors,
    ],
  };
}

export const invalidToken = (input: string): MatcherResult<keyof Tokens> => ({
  type: undefined,
  data: undefined,
  tokenLength: 1,
  syntaxErrors: [
    {
      type: 'SyntaxError',
      start: 0,
      end: 1,
      message: `Illegal character ${input[0]}`,
    },
  ],
});

/**
 * Offset the positions in the error messages to match current position
 */
export const repositionErrors = (
  errors: RA<SyntaxError>,
  positionOffset: number
): RA<SyntaxError> =>
  errors.map(({ start, end, ...error }) => ({
    ...error,
    start: start + positionOffset,
    end: end + positionOffset,
  }));
