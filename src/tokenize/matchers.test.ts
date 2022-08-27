import { theories } from '../tests/utils.js';
import {
  commentMatcher,
  defaultMatcher,
  endMatcher,
  idMatcher,
  intLiteralMatcher,
  stringLiteralMatcher,
  whitespaceMatcher,
} from './matchers.js';

theories(defaultMatcher, [
  [['AND', 'and', 'basic'], undefined],
  [
    ['FOR', 'for', 'for'],
    { data: {}, errors: [], tokenLength: 3, type: 'FOR' },
  ],
  [
    ['AND', 'and', 'and or'],
    { data: {}, errors: [], tokenLength: 3, type: 'AND' },
  ],
  [['WHILE', 'while', 'while1'], undefined],
  [['MAYHEM', 'mayhem', 'mayhemor'], undefined],
  [
    ['ARROW', '->', '->while'],
    {
      data: {},
      errors: [],
      tokenLength: 2,
      type: 'ARROW',
    },
  ],
  [
    ['ARROW', '->', '->='],
    {
      data: {},
      errors: [],
      tokenLength: 2,
      type: 'ARROW',
    },
  ],
]);

theories(endMatcher, [
  [[' '], undefined],
  [
    [''],
    {
      data: {},
      errors: [],
      tokenLength: 0,
      type: 'END',
    },
  ],
]);

theories(idMatcher, [
  /*
   * Reserved keywords are matched by idMatcher, but that's not an issue, as
   * reserved keywords are matched before custom matchers
   */
  [
    ['while'],
    {
      data: {
        literal: 'while',
      },
      errors: [],
      tokenLength: 5,
      type: 'ID',
    },
  ],
  [
    ['while1'],
    {
      data: {
        literal: 'while1',
      },
      errors: [],
      tokenLength: 6,
      type: 'ID',
    },
  ],
  [['123ad'], undefined],
  [['//abc'], undefined],
  [
    ['dope'],
    {
      data: {
        literal: 'dope',
      },
      errors: [],
      tokenLength: 4,
      type: 'ID',
    },
  ],
  [
    ['_some'],
    {
      data: {
        literal: '_some',
      },
      errors: [],
      tokenLength: 5,
      type: 'ID',
    },
  ],
]);

theories(intLiteralMatcher, [
  [
    ['123'],
    { data: { literal: 123 }, errors: [], tokenLength: 3, type: 'INTLITERAL' },
  ],
  [
    ['12.34'],
    { data: { literal: 12 }, errors: [], tokenLength: 2, type: 'INTLITERAL' },
  ],
  [['-1'], undefined],
  [
    ['10_20'],
    { data: { literal: 10 }, errors: [], tokenLength: 2, type: 'INTLITERAL' },
  ],
  [
    ['2147483646'],
    {
      data: { literal: 2_147_483_646 },
      errors: [],
      tokenLength: 10,
      type: 'INTLITERAL',
    },
  ],
  [
    ['2147483647'],
    {
      data: { literal: 2_147_483_647 },
      errors: [],
      tokenLength: 10,
      type: 'INTLITERAL',
    },
  ],
  [
    ['2147483648'],
    {
      data: { literal: 0 },
      errors: [
        {
          message: 'Integer literal overflow',
          start: 0,
          end: 10,
        },
      ],
      tokenLength: 10,
      type: 'INTLITERAL',
    },
  ],
]);

theories(stringLiteralMatcher, [
  [
    ['""'],
    {
      data: { literal: '""' },
      errors: [],
      tokenLength: 2,
      type: 'STRINGLITERAL',
    },
  ],
  [
    ['"&!88"'],
    {
      data: { literal: '"&!88"' },
      errors: [],
      tokenLength: 6,
      type: 'STRINGLITERAL',
    },
  ],
  [
    ['"use \\n to denote a newline character"'],
    {
      data: { literal: '"use \\n to denote a newline character"' },
      errors: [],
      tokenLength: 38,
      type: 'STRINGLITERAL',
    },
  ],
  [
    ['"use \\" to  for a quote and \\\\ for a backslash"'],
    {
      data: { literal: '"use \\" to  for a quote and \\\\ for a backslash"' },
      errors: [],
      tokenLength: 47,
      type: 'STRINGLITERAL',
    },
  ],
  [
    ['"unterminated'],
    {
      data: undefined,
      errors: [
        {
          end: 13,
          message: 'Unterminated string literal detected',
          start: 0,
        },
      ],
      tokenLength: 13,
      type: 'STRINGLITERAL',
    },
  ],
  [
    ['"also unterminated \\"'],
    {
      data: undefined,
      errors: [
        {
          end: 21,
          message: 'Unterminated string literal detected',
          start: 0,
        },
      ],
      tokenLength: 21,
      type: 'STRINGLITERAL',
    },
  ],
  [
    ['"backslash followed by space: \\ is not allowed"'],
    {
      data: undefined,
      errors: [
        {
          end: 47,
          message: 'String literal with bad escape sequence detected',
          start: 0,
        },
      ],
      tokenLength: 47,
      type: 'STRINGLITERAL',
    },
  ],
  [
    ['"bad escaped character: \\a AND not terminated'],
    {
      data: undefined,
      errors: [
        {
          end: 45,
          message:
            'Unterminated string literal with bad escape sequence detected',
          start: 0,
        },
      ],
      tokenLength: 45,
      type: 'STRINGLITERAL',
    },
  ],
]);

theories(commentMatcher, [
  [
    ['//comment'],
    {
      data: undefined,
      errors: [],
      tokenLength: 9,
      type: undefined,
    },
  ],
  [
    ['// Also a comment'],
    {
      data: undefined,
      errors: [],
      tokenLength: 17,
      type: undefined,
    },
  ],
  [['/* not a comment*/'], undefined],
  [['# not a // comment'], undefined],
]);

theories(whitespaceMatcher, [
  [[''], undefined],
  [['abc'], undefined],
  [
    ['  '],
    {
      data: undefined,
      errors: [],
      tokenLength: 2,
      type: undefined,
    },
  ],
  [
    [' \t \r\ndo'],
    {
      data: undefined,
      errors: [],
      tokenLength: 5,
      type: undefined,
    },
  ],
]);
