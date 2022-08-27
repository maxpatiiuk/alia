import { formatErrors } from './formatErrors.js';
import { formatTokens } from './formatTokens.js';
import { tokenize } from './tokenize/index.js';
import { cretePositionResolver } from './utils/resolvePosition.js';

export function parse(rawText: string): {
  readonly formattedErrors: string;
  readonly output: string;
} {
  const { tokens, errors } = tokenize(rawText, 0);

  const positionResolver = cretePositionResolver(rawText);
  return {
    formattedErrors: formatErrors(errors, positionResolver),
    output: formatTokens(tokens, positionResolver),
  };
}
