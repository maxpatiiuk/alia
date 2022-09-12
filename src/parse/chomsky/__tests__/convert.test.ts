import { theories } from '../../../tests/utils.js';
import { maskTokens, splitLongLines, toChomsky } from '../convert.js';

theories(toChomsky, {
  'calls maskTokens': {
    in: [{ b: [['TRUE', 'TRUE']] }],
    out: { b: [['__TRUE', '__TRUE']], __TRUE: [['TRUE']] },
  },
  'calls splitLongLines': {
    in: [{ a: [['a', 'b', 'c']] }],
    out: { a: [['__a__b', 'c']], __a__b: [['a', 'b']] },
  },
  'calls eliminateIntermixing': {
    in: [{ a: [['a', 'TRUE', 'FALSE', 'b']], b: [['a']] }],
    out: {
      __FALSE: [['FALSE']],
      __TRUE: [['TRUE']],
      ____a____TRUE____FALSE: [['__a____TRUE', '__FALSE']],
      __a____TRUE: [['a', '__TRUE']],
      a: [['____a____TRUE____FALSE', 'b']],
      b: [['____a____TRUE____FALSE', 'b']],
    },
  },
  'calls simplifyGrammar': {
    in: [{ a: [['a', 'b']], b: [['b', 'a']], c: [['b']] }],
    out: { a: [['a', 'b']], b: [['b', 'a']] },
  },
});

theories(splitLongLines, [
  {
    in: [{ a: [['a']] }],
    out: { a: [['a']] },
  },
  {
    in: [{ a: [['a', 'b', 'c']] }],
    out: { a: [['__a__b', 'c']], __a__b: [['a', 'b']] },
  },
]);

theories(maskTokens, [
  {
    in: [{ a: [['a']] }],
    out: { a: [['a']] },
  },
  {
    in: [{ b: [['TRUE', 'TRUE']] }],
    out: { b: [['__TRUE', '__TRUE']], __TRUE: [['TRUE']] },
  },
  {
    in: [{ b: [['TRUE', 'FALSE']] }],
    out: {
      b: [['__TRUE', '__FALSE']],
      __TRUE: [['TRUE']],
      __FALSE: [['FALSE']],
    },
  },
]);
