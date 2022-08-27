import type { Tokens } from './tokens.js';
import type { MatcherResult } from './types.js';

export function defaultMatcher(
  type: keyof Tokens,
  matcher: string,
  input: string
): MatcherResult<keyof Tokens> | undefined {
  if (!input.startsWith(matcher)) return undefined;
  const hasSpecialSymbols = matcher.search(/\W/u) !== -1;
  // Don't match identifiers that begin with a reserved keyword
  if (
    !hasSpecialSymbols &&
    input.search(new RegExp(`^${matcher}\\b`, 'u')) === -1
  )
    return undefined;
  return {
    type,
    data: {},
    tokenLength: matcher.length,
    errors: [],
  };
}

export const endMatcher = (input: string): MatcherResult<'END'> | undefined =>
  input.length === 0
    ? {
        type: 'END',
        data: {},
        tokenLength: 0,
        errors: [],
      }
    : undefined;

const reId = /^[_a-z]\w+/iu;

export function idMatcher(input: string): MatcherResult<'ID'> | undefined {
  const identifier = reId.exec(input)?.[0];
  if (identifier === undefined) return undefined;
  return {
    type: 'ID',
    data: {
      literal: identifier,
    },
    tokenLength: identifier.length,
    errors: [],
  };
}

const reInt = /^\d+/u;
export const INT_MAX = 2_147_483_647;

export function intLiteralMatcher(
  input: string
): MatcherResult<'INTLITERAL'> | undefined {
  const rawNumber = reInt.exec(input)?.[0];
  if (rawNumber === undefined) return undefined;
  const number = Number.parseInt(rawNumber);
  return {
    type: 'INTLITERAL',
    data: {
      literal: number > INT_MAX ? 0 : number,
    },
    tokenLength: rawNumber.length,
    errors:
      number > INT_MAX
        ? [
            {
              message: 'Integer literal overflow',
              start: 0,
              end: rawNumber.length,
            },
          ]
        : [],
  };
}

export function stringLiteralMatcher(
  input: string
): MatcherResult<'STRINGLITERAL'> | undefined {
  if (!input.startsWith('"')) return undefined;
  const lineEnd = input.indexOf('\n');
  const line = lineEnd === -1 ? input : input.slice(0, lineEnd);

  let tokenLength = 1;
  let isEscaped = false;
  let isTerminated = false;
  let hasInvalidEscape = false;

  Array.from(line.slice(1)).every((character) => {
    tokenLength += 1;
    if (isEscaped) {
      if (!['n', 't', '\\', '"'].includes(character)) hasInvalidEscape = true;
      isEscaped = false;
    } else if (character === '\\') isEscaped = !isEscaped;
    else if (character === '"') {
      isTerminated = true;
      return false;
    }
    return true;
  });

  const hasErrors = !isTerminated || hasInvalidEscape;
  return {
    type: 'STRINGLITERAL',
    data: hasErrors
      ? undefined
      : {
          literal: line.slice(0, tokenLength),
        },
    tokenLength,
    errors: hasErrors
      ? [
          {
            start: 0,
            end: tokenLength,
            message: hasInvalidEscape
              ? isTerminated
                ? 'String literal with bad escape sequence detected'
                : 'Unterminated string literal with bad escape sequence detected'
              : 'Unterminated string literal detected',
          },
        ]
      : [],
  };
}

const reComment = /^\/\/.*/u;

export function commentMatcher(
  input: string
): MatcherResult<'AND'> | undefined {
  const match = reComment.exec(input);
  if (match === null) return undefined;
  return {
    type: undefined,
    data: undefined,
    tokenLength: match[0].length,
    errors: [],
  };
}

const reWhitespace = /^\s+/u;

export function whitespaceMatcher(
  input: string
): MatcherResult<'AND'> | undefined {
  const match = reWhitespace.exec(input);
  if (match === null) return undefined;
  return {
    type: undefined,
    data: undefined,
    tokenLength: match[0].length,
    errors: [],
  };
}
