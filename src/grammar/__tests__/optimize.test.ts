import { theories } from '../../tests/utils.js';
import { optimizeGrammar, removeTypeFixes } from '../optimize.js';
import {epsilon} from '../utils.js';

theories(optimizeGrammar, {
  'calls removeTypeFixes': {
    in: [
      {
        a: [['a', 'b'], epsilon],
        b: [['a']],
        [epsilon[0]]: [['a', epsilon[0]]],
      },
    ],
    out: {
      a: [['a', 'b'], []],
      b: [['a']],
    },
  },
});

theories(removeTypeFixes, [
  { in: [{}], out: {} },
  {
    in: [
      {
        a: [['a'], epsilon],
        [epsilon[0]]: [['a', epsilon[0]]],
      },
    ],
    out: {
      a: [['a'], []],
    },
  },
]);
