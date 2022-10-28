import { theories } from '../../tests/utils.js';
import { createPositionResolver } from '../../utils/resolvePosition.js';
import {
  invalidToken,
  repositionErrors,
  tokenize as originalTokenize,
} from '../index.js';

function tokenize(rawText: string) {
  const positionResolver = createPositionResolver(rawText);
  return originalTokenize(rawText, 0, positionResolver);
}

theories(tokenize, [
  {
    in: [
      `"sup" and // d
"dope\\n" or`,
    ],
    out: {
      syntaxErrors: [],
      tokens: [
        {
          data: {
            literal: '"sup"',
          },
          position: { columnNumber: 1, lineNumber: 1 },
          type: 'STRINGLITERAL',
        },
        {
          data: {},
          position: { columnNumber: 7, lineNumber: 1 },
          type: 'AND',
        },
        {
          data: {
            literal: '"dope\\n"',
          },
          position: { columnNumber: 1, lineNumber: 2 },
          type: 'STRINGLITERAL',
        },
        {
          data: {},
          position: { columnNumber: 10, lineNumber: 2 },
          type: 'OR',
        },
        {
          data: {},
          position: { columnNumber: 12, lineNumber: 2 },
          type: 'END',
        },
      ],
    },
  },
  {
    in: [
      `"\\b \\" "
"\\b"`,
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
          position: { columnNumber: 5, lineNumber: 2 },
          type: 'END',
        },
      ],
    },
  },
  {
    in: [
      `"
"\\b`,
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
          position: { columnNumber: 4, lineNumber: 2 },
          type: 'END',
        },
      ],
    },
  },
  {
    in: [
      `3
-1`,
    ],
    out: {
      syntaxErrors: [],
      tokens: [
        {
          data: {
            literal: 3,
          },
          position: { columnNumber: 1, lineNumber: 1 },
          type: 'INTLITERAL',
        },
        {
          data: {},
          position: { columnNumber: 1, lineNumber: 2 },
          type: 'MINUS',
        },
        {
          data: {
            literal: 1,
          },
          position: { columnNumber: 2, lineNumber: 2 },
          type: 'INTLITERAL',
        },
        {
          data: {},
          position: { columnNumber: 3, lineNumber: 2 },
          type: 'END',
        },
      ],
    },
  },
  {
    in: [
      `3.2
212,312,123.00`,
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
          position: { columnNumber: 1, lineNumber: 1 },
          type: 'INTLITERAL',
        },
        {
          data: {
            literal: 2,
          },
          position: { columnNumber: 3, lineNumber: 1 },
          type: 'INTLITERAL',
        },
        {
          data: {
            literal: 212,
          },
          position: { columnNumber: 1, lineNumber: 2 },
          type: 'INTLITERAL',
        },
        {
          data: {},
          position: { columnNumber: 4, lineNumber: 2 },
          type: 'COMMA',
        },
        {
          data: {
            literal: 312,
          },
          position: { columnNumber: 5, lineNumber: 2 },
          type: 'INTLITERAL',
        },
        {
          data: {},
          position: { columnNumber: 8, lineNumber: 2 },
          type: 'COMMA',
        },
        {
          data: {
            literal: 123,
          },
          position: { columnNumber: 9, lineNumber: 2 },
          type: 'INTLITERAL',
        },
        {
          data: {
            literal: 0,
          },
          position: { columnNumber: 13, lineNumber: 2 },
          type: 'INTLITERAL',
        },
        {
          data: {},
          position: { columnNumber: 15, lineNumber: 2 },
          type: 'END',
        },
      ],
    },
  },
  {
    in: [
      `100_200
->=`,
    ],
    out: {
      syntaxErrors: [],
      tokens: [
        {
          data: {
            literal: 100,
          },
          position: { columnNumber: 1, lineNumber: 1 },
          type: 'INTLITERAL',
        },
        {
          data: {
            literal: '_200',
          },
          position: { columnNumber: 4, lineNumber: 1 },
          type: 'ID',
        },
        {
          data: {},
          position: { columnNumber: 1, lineNumber: 2 },
          type: 'ARROW',
        },
        {
          data: {},
          position: { columnNumber: 3, lineNumber: 2 },
          type: 'ASSIGN',
        },
        {
          data: {},
          position: { columnNumber: 4, lineNumber: 2 },
          type: 'END',
        },
      ],
    },
  },
  {
    in: [
      `mayhemor
this || or && and do some`,
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
          position: { columnNumber: 1, lineNumber: 1 },
          type: 'ID',
        },
        {
          data: {
            literal: 'this',
          },
          position: { columnNumber: 1, lineNumber: 2 },
          type: 'ID',
        },
        {
          data: {},
          position: { columnNumber: 9, lineNumber: 2 },
          type: 'OR',
        },
        {
          data: {},
          position: { columnNumber: 15, lineNumber: 2 },
          type: 'AND',
        },
        {
          data: {
            literal: 'do',
          },
          position: { columnNumber: 19, lineNumber: 2 },
          type: 'ID',
        },
        {
          data: {
            literal: 'some',
          },
          position: { columnNumber: 22, lineNumber: 2 },
          type: 'ID',
        },
        {
          data: {},
          position: { columnNumber: 26, lineNumber: 2 },
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
          position: { columnNumber: 1, lineNumber: 1 },
          type: 'INTLITERAL',
        },
        {
          data: {
            literal: 2_147_483_647,
          },
          position: { columnNumber: 1, lineNumber: 2 },
          type: 'INTLITERAL',
        },
        {
          data: {
            literal: 0,
          },
          position: { columnNumber: 1, lineNumber: 3 },
          type: 'INTLITERAL',
        },
        {
          data: {},
          position: { columnNumber: 11, lineNumber: 3 },
          type: 'END',
        },
      ],
    },
  },
  {
    in: [`4-- 5++ == 10; 4!=4; 10>=1`],
    out: {
      tokens: [
        {
          data: {
            literal: 4,
          },
          position: { columnNumber: 1, lineNumber: 1 },
          type: 'INTLITERAL',
        },
        {
          data: {},
          position: { columnNumber: 2, lineNumber: 1 },
          type: 'POSTDEC',
        },
        {
          data: {
            literal: 5,
          },
          position: { columnNumber: 5, lineNumber: 1 },
          type: 'INTLITERAL',
        },
        {
          data: {},
          position: { columnNumber: 6, lineNumber: 1 },
          type: 'POSTINC',
        },
        {
          data: {},
          position: { columnNumber: 9, lineNumber: 1 },
          type: 'EQUALS',
        },
        {
          data: {
            literal: 10,
          },
          position: { columnNumber: 12, lineNumber: 1 },
          type: 'INTLITERAL',
        },
        {
          data: {},
          position: { columnNumber: 14, lineNumber: 1 },
          type: 'SEMICOL',
        },
        {
          data: {
            literal: 4,
          },
          position: { columnNumber: 16, lineNumber: 1 },
          type: 'INTLITERAL',
        },
        {
          data: {},
          position: { columnNumber: 17, lineNumber: 1 },
          type: 'NOTEQUALS',
        },
        {
          data: {
            literal: 4,
          },
          position: { columnNumber: 19, lineNumber: 1 },
          type: 'INTLITERAL',
        },
        {
          data: {},
          position: { columnNumber: 20, lineNumber: 1 },
          type: 'SEMICOL',
        },
        {
          data: {
            literal: 10,
          },
          position: { columnNumber: 22, lineNumber: 1 },
          type: 'INTLITERAL',
        },
        {
          data: {},
          position: { columnNumber: 24, lineNumber: 1 },
          type: 'GREATEREQ',
        },
        {
          data: {
            literal: 1,
          },
          position: { columnNumber: 26, lineNumber: 1 },
          type: 'INTLITERAL',
        },
        {
          data: {},
          position: { columnNumber: 27, lineNumber: 1 },
          type: 'END',
        },
      ],
      syntaxErrors: [],
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
