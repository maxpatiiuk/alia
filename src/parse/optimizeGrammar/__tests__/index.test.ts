import { theories } from '../../../tests/utils.js';
import { epsilon } from '../../contextFreeGrammar.js';
import { optimizeGrammar, removeTypeFixes } from '../index.js';

theories(optimizeGrammar, [
  { in: [{}], out: {} },
  {
    in: [
      {
        a: [['b'], ['a'], ['TRUE'], ['TRUE', 'FALSE'], epsilon],
        b: [['FALSE']],
        c: [['TRUE']],
        z: [
          ['a', 'b'],
          ['a', 'b', 'c'],
        ],
        _: [['a']],
        [epsilon[0]]: [[epsilon[0]]],
      },
    ],
    out: {
      a: [[], ['TRUE', 'FALSE'], ['TRUE'], ['b'], ['a']],
      z__a: [['b', 'z__a__b']],
      b: [['FALSE']],
      z__a__b: [[], ['c']],
      c: [['TRUE']],
      z: [['a', 'z__a']],
    },
  },
]);

theories(removeTypeFixes, [
  { in: [{}], out: {} },
  {
    in: [
      {
        a: [['a'], epsilon],
        _: [['a']],
        [epsilon[0]]: [[epsilon[0]]],
      },
    ],
    out: {
      a: [['a'], []],
    },
  },
]);
