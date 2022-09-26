import { formatErrors } from './formatErrors.js';
import { tokenize } from './tokenize/index.js';
import { cretePositionResolver } from './utils/resolvePosition.js';
import { formatTokens } from './formatTokens.js';
import {Token} from './tokenize/types.js';
import {RA} from './utils/types.js';

export function process(rawText: string): {
  readonly formattedErrors: string;
  readonly formattedTokens: string;
  readonly tokens: RA<Token>;
} {
  const { tokens, syntaxErrors } = tokenize(rawText, 0);

  const positionResolver = cretePositionResolver(rawText);

  return {
    formattedErrors: formatErrors(syntaxErrors, positionResolver),
    formattedTokens: formatTokens(tokens, positionResolver),
    tokens,
  };
}
