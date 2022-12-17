import {
  exportsForTests,
  findAllIndexesOf,
  getFollowSets,
} from '../followSets.js';
import {theories} from '../../tests/utils.js';

const { findTerminalEndings } = exportsForTests;

theories(getFollowSets, [
  {
    in: [
      {
        s: [['a'], ['b', 'r']],
        q: [],
        r: [
          ['q', 'c'],
          ['q', 's'],
          ['q', 'q'],
        ],
      },
      {
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
    ],
    out: {
      s: new Set(['']),
      q: new Set(['c', 'a', 'b', '']),
      r: new Set(['']),
    },
  },
]);

theories(findTerminalEndings, [
  {
    in: [
      {
        a: [['b', 'a', 'c', 'a', 'd']],
        b: [['a'], []],
      },
      'a',
    ],
    out: [
      { terminalName: 'a', ending: ['c', 'a', 'd'] },
      { terminalName: 'a', ending: ['d'] },
      { terminalName: 'b', ending: [] },
    ],
  },
]);

theories(findAllIndexesOf, [
  { in: [[], 'a'], out: [] },
  { in: [['a'], 'a'], out: [0] },
  { in: [['b'], 'a'], out: [] },
  { in: [[1, 0, 2, 0, 3, 0], 0], out: [1, 3, 5] },
]);
