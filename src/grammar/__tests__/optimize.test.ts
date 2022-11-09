import { theories } from '../../tests/utils.js';
import { optimizeGrammar, removeTypeFixes } from '../optimize.js';
import { epsilon } from '../utils.js';
import { TypeListNode } from '../../ast/definitions/types/TypeListNode.js';

const ast = () => new TypeListNode([]);

theories(optimizeGrammar, {
  'calls removeTypeFixes': {
    in: [
      {
        a: [
          ['a', 'b', ast],
          [...epsilon, ast],
        ],
        b: [['a', ast]],
        [epsilon[0]]: [['a', epsilon[0], ast]],
      },
    ],
    out: {
      a: [['a', 'b', ast], [ast]],
      b: [['a', ast]],
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
