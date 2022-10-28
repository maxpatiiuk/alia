import {
  createPositionResolver as createResolver,
  createReversePositionResolver as createReverseResolver,
} from '../resolvePosition.js';
import { theories } from '../../tests/utils.js';
import { Position } from '../../tokenize/types.js';

const input = `
int a;
  int b;
int c;
`;

const positionResolver = createResolver(input);
const createPositionResolver = (input: number): Position =>
  positionResolver(input);

theories(createPositionResolver, [
  {
    in: [0],
    out: { lineNumber: 1, columnNumber: 1 },
  },
  {
    in: [4],
    out: { lineNumber: 2, columnNumber: 4 },
  },
  {
    in: [8],
    out: { lineNumber: 3, columnNumber: 1 },
  },
  {
    in: [12],
    out: { lineNumber: 3, columnNumber: 5 },
  },
  {
    in: [16],
    out: { lineNumber: 3, columnNumber: 9 },
  },
]);

const reverseResolver = createReverseResolver(input);
const createReversePositionResolver = (position: Position): number =>
  reverseResolver(position);
theories(createReversePositionResolver, [
  {
    in: [{ lineNumber: 1, columnNumber: 1 }],
    out: 0,
  },
  {
    in: [{ lineNumber: 2, columnNumber: 4 }],
    out: 4,
  },
  {
    in: [{ lineNumber: 3, columnNumber: 1 }],
    out: 8,
  },
  {
    in: [{ lineNumber: 3, columnNumber: 5 }],
    out: 12,
  },
  {
    in: [{ lineNumber: 3, columnNumber: 9 }],
    out: 16,
  },
]);
