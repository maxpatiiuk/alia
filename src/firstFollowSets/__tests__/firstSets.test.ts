import { theories } from '../../../../t2/src/tests/utils.js';
import {
  exportsForTests,
  findAllSubsets,
  getFirstSets,
  lineToString,
  saturateSets,
} from '../firstSets.js';

const { getSetsLength, buildSet } = exportsForTests;

theories(getFirstSets, [
  {
    in: [
      {
        s: [['a'], ['b', 'r']],
        q: [[]],
        r: [
          ['q', 'c'],
          ['q', 's'],
          ['q', 'q'],
        ],
      },
    ],
    out: {
      '["s"]': new Set<string>(['a', 'b']),
      '["q"]': new Set<string>(['']),
      '["r"]': new Set<string>(['c', 'a', 'b', '']),
      '["a"]': new Set(['a']),
      '["b"]': new Set(['b']),
      '["c"]': new Set(['c']),
      '["b","r"]': new Set(['b']),
      '["q","c"]': new Set<string>(['c']),
      '["q","s"]': new Set<string>(['a', 'b']),
      '["q","q"]': new Set<string>(['']),
      '[]': new Set(['']),
    },
  },
  {
    name: 'non-terminal with epsilon results in next first set being appended',
    in: [{ a: [['b', 'c']], b: [['d'], []] }],
    out: {
      '["a"]': new Set(['d', 'c']),
      '["b","c"]': new Set(['d', 'c']),
      '["b"]': new Set(['d', '']),
      '["c"]': new Set(['c']),
      '["d"]': new Set(['d']),
      '[]': new Set(['']),
    },
  },
  {
    name: 'if all parts have epsilons, result has epsilon too',
    in: [
      {
        a: [['b', 'c']],
        b: [['d'], []],
        c: [['e'], []],
      },
    ],
    out: {
      '["a"]': new Set(['d', 'e', '']),
      '["b","c"]': new Set(['d', 'e', '']),
      '["c"]': new Set(['e', '']),
      '["b"]': new Set(['d', '']),
      '["d"]': new Set(['d']),
      '["e"]': new Set(['e']),
      '[]': new Set(['']),
    },
  },
]);

theories(findAllSubsets, [
  {
    in: [[]],
    out: [],
  },
  {
    in: [[1, 2, 3]],
    out: [[1], [1, 2], [1, 2, 3], [2], [2, 3], [3]],
  },
]);

theories(lineToString, [
  {
    in: [[]],
    out: '[]',
  },
  {
    in: [['a', 'b']],
    out: '["a","b"]',
  },
]);

theories(saturateSets, [
  {
    in: [
      (sets) =>
        sets.a.size < 5
          ? { a: new Set([...Array.from(sets.a), sets.a.size.toString()]) }
          : { ...sets },
      { a: new Set([]) },
    ],
    out: { a: new Set(['0', '1', '2', '3', '4']) },
  },
]);

theories(getSetsLength, [
  {
    in: [{}],
    out: 0,
  },
  {
    in: [{ a: new Set(['a', 'b']) }],
    out: 2,
  },
]);

theories(buildSet, [
  {
    in: [{ a: [['b']] }, {}, 'b'],
    out: new Set(['b']),
  },
  {
    in: [
      { a: [['b'], ['c', 'd']] },
      {
        '["b"]': new Set(['b']),
        '["c","d"]': new Set(['d', 'e']),
      },
      'a',
    ],
    out: new Set(['b', 'd', 'e']),
  },
  {
    in: [{ a: [[]] }, { '[]': new Set([]) }, 'a'],
    out: new Set([]),
  },
]);
