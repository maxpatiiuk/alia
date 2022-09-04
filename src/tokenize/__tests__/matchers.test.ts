import { theories } from '../../tests/utils.js';
import {
  commentMatcher,
  defaultMatcher,
  endMatcher,
  idMatcher,
  intLiteralMatcher,
  stringLiteralMatcher,
  whitespaceMatcher,
} from '../matchers.js';

theories(defaultMatcher, [
  { in: ['AND', 'and', 'basic'], out: undefined },
  {
    in: ['FOR', 'for', 'for'],
    out: { data: {}, syntaxErrors: [], tokenLength: 3, type: 'FOR' },
  },
  {
    in: ['AND', 'and', 'and or'],
    out: { data: {}, syntaxErrors: [], tokenLength: 3, type: 'AND' },
  },
  { in: ['WHILE', 'while', 'while1'], out: undefined },
  { in: ['MAYHEM', 'mayhem', 'mayhemor'], out: undefined },
  {
    in: ['ARROW', '->', '->while'],
    out: {
      data: {},
      syntaxErrors: [],
      tokenLength: 2,
      type: 'ARROW',
    },
  },
  {
    in: ['ARROW', '->', '->='],
    out: {
      data: {},
      syntaxErrors: [],
      tokenLength: 2,
      type: 'ARROW',
    },
  },
]);

theories(endMatcher, [
  { in: [' '], out: undefined },
  {
    in: [''],
    out: {
      data: {},
      syntaxErrors: [],
      tokenLength: 0,
      type: 'END',
    },
  },
]);

theories(idMatcher, [
  /*
   * Reserved keywords are matched by idMatcher, but that's not an issue, as
   * reserved keywords are matched before custom matchers
   */
  {
    in: ['while'],
    out: {
      data: {
        literal: 'while',
      },
      syntaxErrors: [],
      tokenLength: 5,
      type: 'ID',
    },
  },
  {
    in: ['while1'],
    out: {
      data: {
        literal: 'while1',
      },
      syntaxErrors: [],
      tokenLength: 6,
      type: 'ID',
    },
  },
  { in: ['123ad'], out: undefined },
  { in: ['//abc'], out: undefined },
  {
    in: ['dope'],
    out: {
      data: {
        literal: 'dope',
      },
      syntaxErrors: [],
      tokenLength: 4,
      type: 'ID',
    },
  },
  {
    in: ['_some'],
    out: {
      data: {
        literal: '_some',
      },
      syntaxErrors: [],
      tokenLength: 5,
      type: 'ID',
    },
  },
]);

theories(intLiteralMatcher, [
  {
    in: ['123'],
    out: {
      data: { literal: 123 },
      syntaxErrors: [],
      tokenLength: 3,
      type: 'INTLITERAL',
    },
  },
  {
    in: ['12.34'],
    out: {
      data: { literal: 12 },
      syntaxErrors: [],
      tokenLength: 2,
      type: 'INTLITERAL',
    },
  },
  { in: ['-1'], out: undefined },
  {
    in: ['10_20'],
    out: {
      data: { literal: 10 },
      syntaxErrors: [],
      tokenLength: 2,
      type: 'INTLITERAL',
    },
  },
  {
    in: ['2147483646'],
    out: {
      data: { literal: 2_147_483_646 },
      syntaxErrors: [],
      tokenLength: 10,
      type: 'INTLITERAL',
    },
  },
  {
    in: ['2147483647'],
    out: {
      data: { literal: 2_147_483_647 },
      syntaxErrors: [],
      tokenLength: 10,
      type: 'INTLITERAL',
    },
  },
  {
    in: ['2147483648'],
    out: {
      data: { literal: 0 },
      syntaxErrors: [
        {
          type: 'SyntaxError',
          message: 'Integer literal overflow',
          start: 0,
          end: 10,
        },
      ],
      tokenLength: 10,
      type: 'INTLITERAL',
    },
  },
]);

theories(stringLiteralMatcher, [
  {
    in: ['""'],
    out: {
      data: { literal: '""' },
      syntaxErrors: [],
      tokenLength: 2,
      type: 'STRINGLITERAL',
    },
  },
  {
    in: ['"&!88"'],
    out: {
      data: { literal: '"&!88"' },
      syntaxErrors: [],
      tokenLength: 6,
      type: 'STRINGLITERAL',
    },
  },
  {
    in: ['"use \\n to denote a newline character"'],
    out: {
      data: { literal: '"use \\n to denote a newline character"' },
      syntaxErrors: [],
      tokenLength: 38,
      type: 'STRINGLITERAL',
    },
  },
  {
    in: ['"use \\" to  for a quote and \\\\ for a backslash"'],
    out: {
      data: { literal: '"use \\" to  for a quote and \\\\ for a backslash"' },
      syntaxErrors: [],
      tokenLength: 47,
      type: 'STRINGLITERAL',
    },
  },
  {
    in: ['"unterminated'],
    out: {
      data: undefined,
      syntaxErrors: [
        {
          type: 'SyntaxError',
          end: 13,
          message: 'Unterminated string literal detected',
          start: 0,
        },
      ],
      tokenLength: 13,
      type: 'STRINGLITERAL',
    },
  },
  {
    in: ['"also unterminated \\"'],
    out: {
      data: undefined,
      syntaxErrors: [
        {
          type: 'SyntaxError',
          end: 21,
          message: 'Unterminated string literal detected',
          start: 0,
        },
      ],
      tokenLength: 21,
      type: 'STRINGLITERAL',
    },
  },
  {
    in: ['"backslash followed by space: \\ is not allowed"'],
    out: {
      data: undefined,
      syntaxErrors: [
        {
          type: 'SyntaxError',
          end: 47,
          message: 'String literal with bad escape sequence detected',
          start: 0,
        },
      ],
      tokenLength: 47,
      type: 'STRINGLITERAL',
    },
  },
  {
    in: ['"bad escaped character: \\a AND not terminated'],
    out: {
      data: undefined,
      syntaxErrors: [
        {
          type: 'SyntaxError',
          end: 45,
          message:
            'Unterminated string literal with bad escape sequence detected',
          start: 0,
        },
      ],
      tokenLength: 45,
      type: 'STRINGLITERAL',
    },
  },
]);

theories(commentMatcher, [
  {
    in: ['//comment'],
    out: {
      data: undefined,
      syntaxErrors: [],
      tokenLength: 9,
      type: undefined,
    },
  },
  {
    in: ['// Also a comment'],
    out: {
      data: undefined,
      syntaxErrors: [],
      tokenLength: 17,
      type: undefined,
    },
  },
  { in: ['/* not a comment*/'], out: undefined },
  { in: ['# not a // comment'], out: undefined },
]);

theories(whitespaceMatcher, [
  { in: [''], out: undefined },
  { in: ['abc'], out: undefined },
  {
    in: ['  '],
    out: {
      data: undefined,
      syntaxErrors: [],
      tokenLength: 2,
      type: undefined,
    },
  },
  {
    in: [' \t \r\ndo'],
    out: {
      data: undefined,
      syntaxErrors: [],
      tokenLength: 5,
      type: undefined,
    },
  },
]);
