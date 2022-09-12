import { formatErrors } from './formatErrors.js';
import { parse } from './parse/index.js';
import { tokenize } from './tokenize/index.js';
import { cretePositionResolver } from './utils/resolvePosition.js';

export function process(rawText: string): {
  readonly formattedErrors: string;
  readonly parseResult: boolean;
} {
  const { tokens, syntaxErrors } = tokenize(rawText, 0);

  const positionResolver = cretePositionResolver(rawText);

  // Don't include the END token
  const trimmedStream = tokens.slice(0, -1);
  const parseResult = syntaxErrors.length === 0 ? parse(trimmedStream) : false;

  return {
    formattedErrors: formatErrors(syntaxErrors, positionResolver),
    parseResult,
  };
}
