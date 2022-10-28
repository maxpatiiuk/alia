import { formatName, formatTokens } from '../formatTokens.js';
import { theories } from '../tests/utils.js';

theories(formatTokens, [
  {
    in: [
      [
        {
          type: 'AND',
          data: {},
          position: { lineNumber: 1, columnNumber: 1 },
        },
      ],
    ],
    out: 'AND [1,1]',
  },
  {
    in: [
      [
        {
          type: 'STRINGLITERAL',
          data: { literal: 'Test' },
          position: { lineNumber: 1, columnNumber: 1 },
        },
        {
          type: 'INTLITERAL',
          data: { literal: 10 },
          position: { lineNumber: 3, columnNumber: 2 },
        },
      ],
    ],
    out: 'STRINGLIT:Test [1,1]\nINTLIT:10 [3,2]',
  },
]);

theories(formatName, [
  { in: ['AND', {}], out: 'AND' },
  { in: ['STRINGLITERAL', { literal: 'Test' }], out: 'STRINGLIT:Test' },
  { in: ['INTLITERAL', { literal: 10 }], out: 'INTLIT:10' },
  { in: ['ID', { literal: 'while1' }], out: 'ID:while1' },
]);
