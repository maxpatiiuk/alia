import { theories } from '../../../tests/utils.js';
import { simplifyGrammar } from '../simplify.js';

theories(simplifyGrammar, {
  'calls removeNullProductions': {
    in: [{ a: [['a', 'b']], b: [['c', 'b'], []], c: [['b', 'c']] }],
    out: {
      a: [['a', 'b'], ['a']],
      b: [['c', 'b'], ['b', 'c'], ['c']],
      c: [['b', 'c'], ['c']],
    },
  },
  'calls removeUnitProductions': {
    in: [{ a: [['b'], ['EQUALS']], b: [['TRUE'], ['FALSE']] }],
    out: {
      a: [['TRUE'], ['FALSE'], ['EQUALS']],
    },
  },
  'calls removeUselessProductions': {
    in: [{ a: [['a', 'b']], b: [['b', 'a']], c: [['b']] }],
    out: { a: [['a', 'b']], b: [['b', 'a']] },
  },
});
