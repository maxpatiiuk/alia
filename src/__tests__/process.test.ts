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
      parseResult: false,
    },
  },
]);
