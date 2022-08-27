import type { Position } from '../tokenize/types.js';

/**
 * Create a function that converts character number to line number and column
 * number
 */
export const cretePositionResolver =
  (input: string): ((position: number) => Position) =>
  (position: number) => {
    const sliced = input.slice(0, position);
    const lines = sliced.split('\n');
    // "+1" converts 0-based position into 1-based position
    return { lineNumber: lines.length, columnNumber: lines.at(-1)!.length + 1 };
  };
