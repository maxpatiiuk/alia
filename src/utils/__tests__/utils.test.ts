import { theories } from '../../tests/utils.js';
import {
  findArrayDivergencePoint,
  group,
  mappedFind,
  removeItem,
  replaceItem,
  sortFunction,
  split,
} from '../utils.js';

describe('mappedFind', () => {
  test('Found value', () =>
    expect(
      mappedFind([undefined, 1, 2, 3, 4, 5], (value) =>
        typeof value === 'number' ? value * 2 : undefined
      )
    ).toBe(2));
  test('Not found a value', () =>
    expect(
      mappedFind([undefined, undefined, undefined], (a) => a)
    ).toBeUndefined());
});

theories(split, [
  {
    in: [[1, 2, 3, 4, 5, 6, 7, 8], (value: number): boolean => value % 2 === 0],
    out: [
      [1, 3, 5, 7],
      [2, 4, 6, 8],
    ],
  },
]);

theories(findArrayDivergencePoint, {
  'empty Array': { in: [[], []], out: 0 },
  'empty Search Array': { in: [['a'], []], out: 0 },
  'empty Source Array': { in: [[], ['a']], out: -1 },
  'identical arrays': {
    in: [
      ['a', 'b'],
      ['a', 'b'],
    ],
    out: 1,
  },
  'divergent arrays': {
    in: [
      ['a', 'b', 'c'],
      ['a', 'b', 'd'],
    ],
    out: -1,
  },
  'sub-array': {
    in: [
      ['a', 'b', 'c'],
      ['a', 'b'],
    ],
    out: 2,
  },
});

theories(removeItem, {
  'remove from the beginning': { in: [[0, 1, 2, 3, 4], 0], out: [1, 2, 3, 4] },
  'remove in the middle': { in: [[1, 0, 2, 3, 4], 1], out: [1, 2, 3, 4] },
  'remove at the end': { in: [[1, 2, 3, 4, 0], 4], out: [1, 2, 3, 4] },
  'remove from the end': { in: [[1, 2, 3, 0, 4], -1], out: [1, 2, 3, 4] },
  'remove after the end': { in: [[1, 2, 3, 4], 99], out: [1, 2, 3, 4] },
});

theories(replaceItem, {
  'replace at the beginning': { in: [[0, 2, 3, 4], 0, 1], out: [1, 2, 3, 4] },
  'replace in the middle': { in: [[1, 0, 3, 4], 1, 2], out: [1, 2, 3, 4] },
  'replace at the end': { in: [[1, 2, 3, 0], 3, 4], out: [1, 2, 3, 4] },
  'replace from the end': { in: [[1, 2, 3, 0], -1, 4], out: [1, 2, 3, 4] },
  'replace after the end': { in: [[1, 2, 3], 99, 4], out: [1, 2, 3, 4] },
});

describe('sortFunction', () => {
  test('Numbers', () => {
    expect([10, 100, 1, 66, 5, 8, 2].sort(sortFunction((a) => a))).toEqual([
      1, 2, 5, 8, 10, 66, 100,
    ]);
  });
  test('Strings', () => {
    expect(['a', '6', 'bb', 'aba', '_a'].sort(sortFunction((a) => a))).toEqual([
      '_a',
      '6',
      'a',
      'aba',
      'bb',
    ]);
  });
  test('Custom function for Numbers', () => {
    expect(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].sort(
        sortFunction((value) => Math.abs(5 - value))
      )
    ).toEqual([5, 4, 6, 3, 7, 2, 8, 1, 9, 10]);
  });
  test('Custom function for Numbers (reversed)', () => {
    expect(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].sort(
        sortFunction((value) => Math.abs(5 - value), true)
      )
    ).toEqual([10, 1, 9, 2, 8, 3, 7, 4, 6, 5]);
  });
});

theories(group, [
  {
    in: [
      [
        ['a', 1],
        ['a', 2],
        ['b', 3],
        ['c', 4],
        ['a', 5],
      ],
    ],
    out: [
      ['a', [1, 2, 5]],
      ['b', [3]],
      ['c', [4]],
    ],
  },
]);
