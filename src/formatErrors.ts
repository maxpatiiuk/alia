import type { ParseError, Position } from './tokenize/types.js';
import type { RA } from './utils/types.js';

export const formatErrors = (
  errors: RA<ParseError>,
  positionResolver: (simplePosition: number) => Position
): string =>
  errors
    .map(
      ({ start, end, message }) =>
        `FATAL ${formatPosition(positionResolver(start))}-${formatPosition(
          positionResolver(end)
        )}: ${message}`
    )

    .join('\n');

export const formatPosition = ({
  lineNumber,
  columnNumber,
}: Position): string => `[${lineNumber},${columnNumber}]`;
