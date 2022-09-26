import { theories } from '../../../tests/utils.js';
import { epsilon } from '../../contextFreeGrammar.js';
import { optimizeGrammar, removeTypeFixes } from '../index.js';

theories(optimizeGrammar, {
  'calls toChomsky': {
    in: [{ b: [['TRUE', 'TRUE']] }],
    out: { b: [['__TRUE', '__TRUE']], __TRUE: [['TRUE']] },
  },
  'calls removeTypeFixes': {
    in: [
      {
        a: [['a', 'b'], epsilon],
        b: [['a']],
        _: [['a']],
        [epsilon[0]]: [[epsilon[0]]],
      },
    ],
    out: {
      a: [['a', 'b'], ['b'], ['a'], []],
      b: [['a', 'b'], ['b'], ['a'], []],
    },
  },
});

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
