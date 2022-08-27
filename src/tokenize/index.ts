import type { RA } from '../utils/types.js';
import { mappedFind } from '../utils/utils.js';
import { complexTokens, simpleTokens } from './definitions.js';
import {
  commentMatcher,
  defaultMatcher,
  whitespaceMatcher,
} from './matchers.js';
import type { Tokens } from './tokens.js';
import type { MatcherResult, ParseError, Token } from './types.js';

export function tokenize(
  input: string,
  positionOffset: number
): {
  readonly tokens: RA<Token>;
  readonly errors: RA<ParseError>;
} {
  const { type, data, tokenLength, errors } =
    mappedFind(simpleTokens, ([type, matcher]) =>
      defaultMatcher(type, matcher, input)
    ) ??
    mappedFind(complexTokens, ([_type, matcher]) => matcher(input)) ??
    commentMatcher(input) ??
    whitespaceMatcher(input) ??
    invalidToken(input);

  const remainingInput = input.slice(tokenLength);
  const { tokens, errors: additionalErrors } =
    type === 'END'
      ? {
          tokens: [],
          errors: [],
        }
      : tokenize(remainingInput, positionOffset + tokenLength);

  const token: Token | undefined =
    typeof data === 'object' && typeof type === 'string'
      ? {
          type,
          data,
          simplePosition: positionOffset,
        }
      : undefined;

  return {
    tokens: [...(typeof token === 'object' ? [token] : []), ...tokens],
    errors: [...repositionErrors(errors, positionOffset), ...additionalErrors],
  };
}

export const invalidToken = (input: string): MatcherResult<keyof Tokens> => ({
  type: undefined,
  data: undefined,
  tokenLength: 1,
  errors: [
    {
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
  errors: RA<ParseError>,
  positionOffset: number
): RA<ParseError> =>
  errors.map(({ start, end, ...error }) => ({
    ...error,
    start: start + positionOffset,
    end: end + positionOffset,
  }));
