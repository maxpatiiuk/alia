import { theories } from '../../tests/utils.js';
import { invalidToken, repositionErrors, tokenize } from '../index.js';

theories(tokenize, [
  {
    in: [
      `"sup" and
"dope\\n" or`,
      0,
    ],
    out: {
      syntaxErrors: [],
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
  },
  {
    in: [
      `"\\b \\" "
"\\b"`,
      0,
    ],
    out: {
      syntaxErrors: [
        {
          type: 'SyntaxError',
          end: 8,
          message: 'String literal with bad escape sequence detected',
          start: 0,
        },
        {
          type: 'SyntaxError',
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
  },
  {
    in: [
      `"
"\\b`,
      0,
    ],
    out: {
      syntaxErrors: [
        {
          type: 'SyntaxError',
          end: 1,
          message: 'Unterminated string literal detected',
          start: 0,
        },
        {
          type: 'SyntaxError',
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
  },
  {
    in: [
      `3
-1`,
      0,
    ],
    out: {
      syntaxErrors: [],
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
  },
  {
    in: [
      `3.2
212,312,123.00`,
      0,
    ],
    out: {
      syntaxErrors: [
        {
          type: 'SyntaxError',
          end: 2,
          message: 'Illegal character .',
          start: 1,
        },
        {
          type: 'SyntaxError',
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
  },
  {
    in: [
      `100_200
->=`,
      0,
    ],
    out: {
      syntaxErrors: [],
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
  },
  {
    in: [
      `mayhemor
this || or && and do some`,
      0,
    ],
    out: {
      syntaxErrors: [
        {
          type: 'SyntaxError',
          end: 15,
          message: 'Illegal character |',
          start: 14,
        },
        {
          type: 'SyntaxError',
          end: 16,
          message: 'Illegal character |',
          start: 15,
        },
        {
          type: 'SyntaxError',
          end: 21,
          message: 'Illegal character &',
          start: 20,
        },
        {
          type: 'SyntaxError',
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
  },
  {
    in: [
      `2147483646
2147483647
2147483648`,
      0,
    ],
    out: {
      syntaxErrors: [
        {
          type: 'SyntaxError',
          end: 32,
          message: 'Integer literal overflow',
          start: 22,
        },
      ],
      tokens: [
        {
          data: {
            literal: 2_147_483_646,
          },
          simplePosition: 0,
          type: 'INTLITERAL',
        },
        {
          data: {
            literal: 2_147_483_647,
          },
          simplePosition: 11,
          type: 'INTLITERAL',
        },
        {
          data: {
            literal: 0,
          },
          simplePosition: 22,
          type: 'INTLITERAL',
        },
        {
          data: {},
          simplePosition: 32,
          type: 'END',
        },
      ],
    },
  },
]);

theories(invalidToken, [
  {
    in: ['Test'],
    out: {
      type: undefined,
      data: undefined,
      tokenLength: 1,
      syntaxErrors: [
        {
          type: 'SyntaxError',
          start: 0,
          end: 1,
          message: `Illegal character T`,
        },
      ],
    },
  },
]);

theories(repositionErrors, [
  {
    in: [
      [
        {
          type: 'SyntaxError',
          start: 3,
          end: 10,
          message: 'Error message',
        },
        {
          type: 'SyntaxError',
          start: 1,
          end: 20,
          message: 'Error message #2',
        },
      ],
      10,
    ],
    out: [
      {
        type: 'SyntaxError',
        start: 13,
        end: 20,
        message: 'Error message',
      },
      {
        type: 'SyntaxError',
        start: 11,
        end: 30,
        message: 'Error message #2',
      },
    ],
  },
]);
