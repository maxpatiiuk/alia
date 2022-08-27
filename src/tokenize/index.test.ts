import { theories } from '../tests/utils.js';
import { invalidToken, repositionErrors, tokenize } from './index.js';

theories(tokenize, [
  [
    [
      `"sup" and
"dope\\n" or`,
      0,
    ],
    {
      errors: [],
      tokens: [
        {
          data: {
            literal: '"sup"',
          },
          simplePosition: 0,
          type: 'STRINGLITERAL',
        },
        {
          data: {},
          simplePosition: 6,
          type: 'AND',
        },
        {
          data: {
            literal: '"dope\\n"',
          },
          simplePosition: 10,
          type: 'STRINGLITERAL',
        },
        {
          data: {},
          simplePosition: 19,
          type: 'OR',
        },
        {
          data: {},
          simplePosition: 21,
          type: 'END',
        },
      ],
    },
  ],
  [
    [
      `"\\b \\" "
"\\b"`,
      0,
    ],
    {
      errors: [
        {
          end: 8,
          message: 'String literal with bad escape sequence detected',
          start: 0,
        },
        {
          end: 13,
          message: 'String literal with bad escape sequence detected',
          start: 9,
        },
      ],
      tokens: [
        {
          data: {},
          simplePosition: 13,
          type: 'END',
        },
      ],
    },
  ],
  [
    [
      `"
"\\b`,
      0,
    ],
    {
      errors: [
        {
          end: 1,
          message: 'Unterminated string literal detected',
          start: 0,
        },
        {
          end: 5,
          message:
            'Unterminated string literal with bad escape sequence detected',
          start: 2,
        },
      ],
      tokens: [
        {
          data: {},
          simplePosition: 5,
          type: 'END',
        },
      ],
    },
  ],
  [
    [
      `3
-1`,
      0,
    ],
    {
      errors: [],
      tokens: [
        {
          data: {
            literal: 3,
          },
          simplePosition: 0,
          type: 'INTLITERAL',
        },
        {
          data: {},
          simplePosition: 2,
          type: 'MINUS',
        },
        {
          data: {
            literal: 1,
          },
          simplePosition: 3,
          type: 'INTLITERAL',
        },
        {
          data: {},
          simplePosition: 4,
          type: 'END',
        },
      ],
    },
  ],
  [
    [
      `3.2
212,312,123.00`,
      0,
    ],
    {
      errors: [
        {
          end: 2,
          message: 'Illegal character .',
          start: 1,
        },
        {
          end: 16,
          message: 'Illegal character .',
          start: 15,
        },
      ],
      tokens: [
        {
          data: {
            literal: 3,
          },
          simplePosition: 0,
          type: 'INTLITERAL',
        },
        {
          data: {
            literal: 2,
          },
          simplePosition: 2,
          type: 'INTLITERAL',
        },
        {
          data: {
            literal: 212,
          },
          simplePosition: 4,
          type: 'INTLITERAL',
        },
        {
          data: {},
          simplePosition: 7,
          type: 'COMMA',
        },
        {
          data: {
            literal: 312,
          },
          simplePosition: 8,
          type: 'INTLITERAL',
        },
        {
          data: {},
          simplePosition: 11,
          type: 'COMMA',
        },
        {
          data: {
            literal: 123,
          },
          simplePosition: 12,
          type: 'INTLITERAL',
        },
        {
          data: {
            literal: 0,
          },
          simplePosition: 16,
          type: 'INTLITERAL',
        },
        {
          data: {},
          simplePosition: 18,
          type: 'END',
        },
      ],
    },
  ],
  [
    [
      `100_200
->=`,
      0,
    ],
    {
      errors: [],
      tokens: [
        {
          data: {
            literal: 100,
          },
          simplePosition: 0,
          type: 'INTLITERAL',
        },
        {
          data: {
            literal: '_200',
          },
          simplePosition: 3,
          type: 'ID',
        },
        {
          data: {},
          simplePosition: 8,
          type: 'ARROW',
        },
        {
          data: {},
          simplePosition: 10,
          type: 'ASSIGN',
        },
        {
          data: {},
          simplePosition: 11,
          type: 'END',
        },
      ],
    },
  ],
  [
    [
      `mayhemor
this || or && and do some`,
      0,
    ],
    {
      errors: [
        {
          end: 15,
          message: 'Illegal character |',
          start: 14,
        },
        {
          end: 16,
          message: 'Illegal character |',
          start: 15,
        },
        {
          end: 21,
          message: 'Illegal character &',
          start: 20,
        },
        {
          end: 22,
          message: 'Illegal character &',
          start: 21,
        },
      ],
      tokens: [
        {
          data: {
            literal: 'mayhemor',
          },
          simplePosition: 0,
          type: 'ID',
        },
        {
          data: {
            literal: 'this',
          },
          simplePosition: 9,
          type: 'ID',
        },
        {
          data: {},
          simplePosition: 17,
          type: 'OR',
        },
        {
          data: {},
          simplePosition: 23,
          type: 'AND',
        },
        {
          data: {
            literal: 'do',
          },
          simplePosition: 27,
          type: 'ID',
        },
        {
          data: {
            literal: 'some',
          },
          simplePosition: 30,
          type: 'ID',
        },
        {
          data: {},
          simplePosition: 34,
          type: 'END',
        },
      ],
    },
  ],
]);

theories(invalidToken, [
  [
    ['Test'],
    {
      type: undefined,
      data: undefined,
      tokenLength: 1,
      errors: [
        {
          start: 0,
          end: 1,
          message: `Illegal character T`,
        },
      ],
    },
  ],
]);

theories(repositionErrors, [
  [
    [
      [
        { start: 3, end: 10, message: 'Error message' },
        {
          start: 1,
          end: 20,
          message: 'Error message #2',
        },
      ],
      10,
    ],
    [
      { start: 13, end: 20, message: 'Error message' },
      {
        start: 11,
        end: 30,
        message: 'Error message #2',
      },
    ],
  ],
]);
