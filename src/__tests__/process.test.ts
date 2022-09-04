import { process } from '../process.js';
import { theories } from '../tests/utils.js';

theories(process, [
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
      tokenStream: `STRINGLIT:"sup" [1,1]
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
      parseTree: {
        type: 'program',
        children: [],
      },
      parseErrors: [],
    },
  },
]);
