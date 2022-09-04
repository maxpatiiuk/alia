import { formatName, formatTokens } from '../formatTokens.js';
import { theories } from '../tests/utils.js';
import { cretePositionResolver } from '../utils/resolvePosition.js';

const positionResolver = cretePositionResolver(`
Example
Text
Here
`);

theories(formatTokens, [
  {
    in: [
      [
        {
          type: 'AND',
          data: {},
          simplePosition: 0,
        },
      ],
      positionResolver,
    ],
    out: 'AND [1,1]',
  },
  {
    in: [
      [
        {
          type: 'STRINGLITERAL',
          data: { literal: 'Test' },
          simplePosition: 0,
        },
        {
          type: 'INTLITERAL',
          data: { literal: 10 },
          simplePosition: 10,
        },
      ],
      positionResolver,
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
