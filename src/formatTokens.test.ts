import { formatName, formatTokens } from './formatTokens.js';
import { theories } from './tests/utils.js';
import { cretePositionResolver } from './utils/resolvePosition.js';

const positionResolver = cretePositionResolver(`
Example
Text
Here
`);

theories(formatTokens, [
  [
    [
      [
        {
          type: 'AND',
          data: {},
          simplePosition: 0,
        },
      ],
      positionResolver,
    ],
    'AND [1,1]',
  ],
  [
    [
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
    'STRINGLIT:Test [1,1]\nINTLIT:10 [3,2]',
  ],
]);

theories(formatName, [
  [['AND', {}], 'AND'],
  [['STRINGLITERAL', { literal: 'Test' }], 'STRINGLIT:Test'],
  [['INTLITERAL', { literal: 10 }], 'INTLIT:10'],
  [['ID', { literal: 'while1' }], 'ID:while1'],
]);
