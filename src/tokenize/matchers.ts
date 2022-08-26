import type { MatcherResult } from './types.js';

export function defaultMatcher(
  // Using "AND" rather than a generic just to simplify typing
  type: 'AND',
  matcher: string,
  input: string
): MatcherResult<'AND'> | undefined {
  if (!input.startsWith(matcher)) return undefined;
  const hasSpecialSymbols = matcher.search(/\W/u) !== -1;
  // Don't match identifiers that begin with a reserved keyboard
  if (
    !hasSpecialSymbols &&
    input.search(new RegExp(`${matcher}\b`, 'u')) === -1
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

const reInt = /^(?:<number>\d)+/u;

export function intLiteralMatcher(
  input: string
): MatcherResult<'INTLITERAL'> | undefined {
  const match = reInt.exec(input);
  if (match === null) return undefined;
  const rawNumber = Number.parseInt(match.groups!.number);
  return {
    type: 'INTLITERAL',
    data: {
      literal: rawNumber,
    },
    tokenLength: match.groups!.number.length,
    errors: [],
  };
}

export function stringLiteralMatcher(
  input: string
): MatcherResult<'STRINGLITERAL'> | undefined {
  if (!input.startsWith('"')) return undefined;
  const line = input.slice(0, input.indexOf('\n'));

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

  return {
    type: 'STRINGLITERAL',
    data: {
      literal: line.slice(0, tokenLength),
    },
    tokenLength,
    errors:
      isTerminated && !hasInvalidEscape
        ? []
        : [
            {
              start: 0,
              end: tokenLength,
              message: hasInvalidEscape
                ? isTerminated
                  ? 'String literal with bad escape sequence detected'
                  : 'Unterminated string literal with bad escape sequence detected'
                : 'Unterminated string literal detected',
            },
          ],
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
