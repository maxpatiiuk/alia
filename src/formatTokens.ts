import { formatPosition } from './formatErrors.js';
import type { Tokens } from './tokenize/tokens.js';
import { tokenLabels } from './tokenize/tokens.js';
import type { Position, Token } from './tokenize/types.js';
import type { RA } from './utils/types.js';

export const formatTokens = (
  tokens: RA<Token>,
  positionResolver: (simplePosition: number) => Position
): string =>
  tokens
    .map(
      ({ type, data, simplePosition }) =>
        `${formatName(type, data)} ${formatPosition(
          positionResolver(simplePosition)
        )}`
    )
    .join('\n');

export function formatName<T extends keyof Tokens>(
  type: T,
  data: Tokens[T]
): string {
  const label = type in tokenLabels ? tokenLabels[type] ?? type : type;
  const payload = 'literal' in data ? `:${data.literal}` : '';
  return `${label}${payload}`;
}
