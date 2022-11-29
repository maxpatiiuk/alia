import { processInput } from '../frontEnd.js';
import { theories } from '../tests/utils.js';

theories(processInput, [
  {
    in: [
      `"sup" and
"dope\\n" or
"\\b \\" "
"\\b"
"
"\\b
3
-1
3.2
212,312,123.00
100_200
->=
mayhemor
this || or && and do some
2147483646
2147483647
2147483648
`,
    ],
    out: {
      formattedErrors: `FATAL [3,1]-[3,9]: String literal with bad escape sequence detected
FATAL [4,1]-[4,5]: String literal with bad escape sequence detected
FATAL [5,1]-[5,2]: Unterminated string literal detected
FATAL [6,1]-[6,4]: Unterminated string literal with bad escape sequence detected
FATAL [9,2]-[9,3]: Illegal character .
FATAL [10,12]-[10,13]: Illegal character .
FATAL [14,6]-[14,7]: Illegal character |
FATAL [14,7]-[14,8]: Illegal character |
FATAL [14,12]-[14,13]: Illegal character &
FATAL [14,13]-[14,14]: Illegal character &
FATAL [17,1]-[17,11]: Integer literal overflow`,
      formattedTokens: `STRINGLIT:"sup" [1,1]
AND [1,7]
STRINGLIT:"dope\\n" [2,1]
OR [2,10]
INTLIT:3 [7,1]
MINUS [8,1]
INTLIT:1 [8,2]
INTLIT:3 [9,1]
INTLIT:2 [9,3]
INTLIT:212 [10,1]
COMMA [10,4]
INTLIT:312 [10,5]
COMMA [10,8]
INTLIT:123 [10,9]
INTLIT:0 [10,13]
INTLIT:100 [11,1]
ID:_200 [11,4]
ARROW [12,1]
ASSIGN [12,3]
ID:mayhemor [13,1]
ID:this [14,1]
OR [14,9]
AND [14,15]
ID:do [14,19]
ID:some [14,22]
INTLIT:2147483646 [15,1]
INTLIT:2147483647 [16,1]
INTLIT:0 [17,1]
EOF [18,1]`,
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
          data: {
            literal: 3,
          },
          position: { columnNumber: 1, lineNumber: 7 },
          type: 'INTLITERAL',
        },
        {
          data: {},
          position: { columnNumber: 1, lineNumber: 8 },
          type: 'MINUS',
        },
        {
          data: {
            literal: 1,
          },
          position: { columnNumber: 2, lineNumber: 8 },
          type: 'INTLITERAL',
        },
        {
          data: {
            literal: 3,
          },
          position: { columnNumber: 1, lineNumber: 9 },
          type: 'INTLITERAL',
        },
        {
          data: {
            literal: 2,
          },
          position: { columnNumber: 3, lineNumber: 9 },
          type: 'INTLITERAL',
        },
        {
          data: {
            literal: 212,
          },
          position: { columnNumber: 1, lineNumber: 10 },
          type: 'INTLITERAL',
        },
        {
          data: {},
          position: { columnNumber: 4, lineNumber: 10 },
          type: 'COMMA',
        },
        {
          data: {
            literal: 312,
          },
          position: { columnNumber: 5, lineNumber: 10 },
          type: 'INTLITERAL',
        },
        {
          data: {},
          position: { columnNumber: 8, lineNumber: 10 },
          type: 'COMMA',
        },
        {
          data: {
            literal: 123,
          },
          position: { columnNumber: 9, lineNumber: 10 },
          type: 'INTLITERAL',
        },
        {
          data: {
            literal: 0,
          },
          position: { columnNumber: 13, lineNumber: 10 },
          type: 'INTLITERAL',
        },
        {
          data: {
            literal: 100,
          },
          position: { columnNumber: 1, lineNumber: 11 },
          type: 'INTLITERAL',
        },
        {
          data: {
            literal: '_200',
          },
          position: { columnNumber: 4, lineNumber: 11 },
          type: 'ID',
        },
        {
          data: {},
          position: { columnNumber: 1, lineNumber: 12 },
          type: 'ARROW',
        },
        {
          data: {},
          position: { columnNumber: 3, lineNumber: 12 },
          type: 'ASSIGN',
        },
        {
          data: {
            literal: 'mayhemor',
          },
          position: { columnNumber: 1, lineNumber: 13 },
          type: 'ID',
        },
        {
          data: {
            literal: 'this',
          },
          position: { columnNumber: 1, lineNumber: 14 },
          type: 'ID',
        },
        {
          data: {},
          position: { columnNumber: 9, lineNumber: 14 },
          type: 'OR',
        },
        {
          data: {},
          position: { columnNumber: 15, lineNumber: 14 },
          type: 'AND',
        },
        {
          data: {
            literal: 'do',
          },
          position: { columnNumber: 19, lineNumber: 14 },
          type: 'ID',
        },
        {
          data: {
            literal: 'some',
          },
          position: { columnNumber: 22, lineNumber: 14 },
          type: 'ID',
        },
        {
          data: {
            literal: 2147483646,
          },
          position: { columnNumber: 1, lineNumber: 15 },
          type: 'INTLITERAL',
        },
        {
          data: {
            literal: 2147483647,
          },
          position: { columnNumber: 1, lineNumber: 16 },
          type: 'INTLITERAL',
        },
        {
          data: {
            literal: 0,
          },
          position: { columnNumber: 1, lineNumber: 17 },
          type: 'INTLITERAL',
        },
        {
          data: {},
          position: { columnNumber: 1, lineNumber: 18 },
          type: 'END',
        },
      ],
    },
  },
]);
