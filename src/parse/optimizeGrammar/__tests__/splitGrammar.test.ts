import { theories } from '../../../tests/utils.js';
import {
  deduplicateRule,
  splitGrammar,
  optimizeLines,
} from '../splitGrammar.js';

theories(splitGrammar, [
  {
    in: [
      {
        a: [['a', 'b'], ['a', 'c'], ['b']],
        b: [['a']],
        c: [['a']],
      },
    ],
    out: {
      a: [['b'], ['a', 'a__a']],
      a__a: [['b'], ['c']],
      b: [['a']],
      c: [['a']],
    },
  },
]);

theories(optimizeLines, [
  {
    in: [['a', [['a', 'b'], ['a', 'c'], ['b']]]],
    out: [
      ['a', [['b'], ['a', 'a__a']]],
      ['a__a', [['b'], ['c']]],
    ],
  },
]);

theories(deduplicateRule, [
  {
    in: [
      'a',
      [
        ['a', [['a', 'b'], ['a', 'c'], ['b']]],
        ['b', [['a']]],
      ],
    ],
    out: [
      ['a', [['b'], ['a', 'a__a']]],
      ['a__a', [['b'], ['c']]],
      ['b', [['a']]],
    ],
  },
]);
