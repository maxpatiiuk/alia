import { theories } from '../../../tests/utils.js';
import {
  eliminateEpsilons,
  findNullableRules,
  getPowerSet,
  removeNullProductions,
} from '../removeNullProductions.js';

theories(removeNullProductions, [
  {
    name: 'Null rules are allowed in a root',
    in: [{ a: [['a'], []] }],
    out: { a: [['a'], []] },
  },
  {
    in: [{ a: [['a', 'b']], b: [['c'], []] }],
    out: { a: [['a', 'b'], ['a']], b: [['c']] },
  },
  {
    in: [{ a: [['a'], ['b']], b: [['c'], []] }],
    out: { a: [['a'], ['b'], []], b: [['c']] },
  },
]);

theories(findNullableRules, [
  {
    in: [{ a: [['a']] }, [], []],
    out: [],
  },
  {
    in: [{ a: [['a', 'b']] }, ['b'], []],
    out: [],
  },
  {
    in: [{ a: [['a'], ['b']] }, ['b'], []],
    out: ['a'],
  },
  {
    in: [{ a: [['a'], ['b']], c: [['a']] }, ['b'], []],
    out: ['a', 'c'],
  },
]);

theories(eliminateEpsilons, [
  {
    in: [['a'], []],
    out: [['a']],
  },
  {
    in: [['a', 'b'], ['b']],
    out: [['a', 'b'], ['a']],
  },
]);

theories(getPowerSet, [
  {
    in: [[1, 2, 3]],
    out: [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]],
  },
]);
