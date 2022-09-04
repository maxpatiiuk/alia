import {
  calculateLineDifficulty,
  detectRecursiveRules,
  isRecursiveRule,
  nonRecursiveRuleCost,
  recursionCost,
  reorderRules,
  tokenCost,
} from '../reorderLines.js';
import { theories } from '../../../tests/utils.js';

theories(reorderRules, [
  { in: [{}], out: {} },
  { in: [{ a: [['a']] }], out: { a: [['a']] } },
  { in: [{ a: [['a'], ['TRUE']] }], out: { a: [['TRUE'], ['a']] } },
  {
    in: [{ a: [['b'], ['a'], ['TRUE'], ['TRUE', 'FALSE']], b: [['FALSE']] }],
    out: { a: [['TRUE', 'FALSE'], ['TRUE'], ['b'], ['a']], b: [['FALSE']] },
  },
]);

theories(detectRecursiveRules, [
  { in: [{}], out: [] },
  { in: [{ a: [['a', 'b']], b: [['TRUE']] }], out: ['a'] },
  { in: [{ a: [['b']], b: [['a']] }], out: ['a', 'b'] },
]);

theories(isRecursiveRule, [
  { in: ['a', { a: [] }], out: false },
  { in: ['a', { a: [['b']], b: [] }], out: false },
  { in: ['a', { a: [['b'], ['a']], b: [] }], out: true },
  { in: ['a', { a: [['b']], b: [['a']] }], out: true },
]);

theories(calculateLineDifficulty, [
  { in: [[], []], out: Number.NEGATIVE_INFINITY },
  { in: [['TRUE'], []], out: tokenCost },
  { in: [['a'], []], out: nonRecursiveRuleCost },
  { in: [['a'], ['a']], out: recursionCost },
  {
    in: [['a', 'b', 'TRUE'], ['a']],
    out: recursionCost + nonRecursiveRuleCost + tokenCost,
  },
]);
