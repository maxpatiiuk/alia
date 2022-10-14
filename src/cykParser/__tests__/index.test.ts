import { theories } from '../../tests/utils.js';
import { tokenize } from '../../tokenize/index.js';
import type { Token } from '../../tokenize/types.js';
import { error } from '../../utils/assert.js';
import type { RA } from '../../utils/types.js';
import { cykParser, exportsForTests } from '../index.js';

const {
  parser,
  tokensToString,
  powerSetIterate,
  powerSetIteratorCallback,
  getInverseGrammarIndex,
  getCartesianProduct,
  matchRulePairs,
} = exportsForTests;

theories(cykParser, [
  {
    in: [[]],
    out: true,
  },
  {
    in: [
      [
        {
          type: 'INT',
          data: {},
          simplePosition: 0,
        },
        {
          type: 'ID',
          data: {},
          simplePosition: 5,
        },
        {
          type: 'SEMICOL',
          data: {},
          simplePosition: 7,
        },
      ],
    ],
    out: true,
  },
  {
    in: [
      [
        {
          type: 'VOID',
          data: {},
          simplePosition: 0,
        },
        {
          type: 'INT',
          data: {},
          simplePosition: 0,
        },
      ],
    ],
    out: false,
  },
]);

const input = `
int a;
int b;

bool c;
void d;

int bar(int b, int _3d){
 int a;
}

void bar(){
 int a;
}

fn() -> void bar() {
 int b;
}

fn(int, fn () -> fn () -> void) -> void bar() {
 int b;

 while(-a) {

 }

 // for(int a; int b; int c) {
 //
 // }

 for(int a; TRUE and true; int c) {

 }

 if(false) {}

  // TODO: test 3 * 4 == 42
 if(3 * 4) {} else {
   // test
 }

  val = 4;
  // TODO: test 4--
// TODO: test 5++

  return 4;
  output 10;
  input des;
  output 10*4;
  // TODO: test output 10 != 4;
  // TODO: test output 10 <= 4;
  output 10 < 4;

  some();
  some(do, 10 - 4);

  output FALSE;
  output 10;
  output "Test\\n\\t";
}
`;

theories(parser, [
  {
    // Remove the END token
    in: [tokenize(input, 0).tokens.slice(0, -1)],
    out: true,
  },
  {
    in: [
      [
        ...tokenize(input, 0).tokens.slice(0, -1),
        {
          type: 'INT',
          data: {},
          simplePosition: 0,
        },
        {
          type: 'INT',
          data: {},
          simplePosition: 0,
        },
      ],
    ],
    out: false,
  },
]);

theories(tokensToString, [
  { in: [[]], out: '' },
  {
    in: [
      [
        {
          type: 'INT',
          data: {},
          simplePosition: 0,
        },
        {
          type: 'ID',
          data: {},
          simplePosition: 5,
        },
      ],
    ],
    out: 'INT ID',
  },
]);

theories(powerSetIterate, [
  {
    in: [
      [
        {
          type: 'INT',
          data: {},
          simplePosition: 0,
        },
        {
          type: 'ID',
          data: {},
          simplePosition: 5,
        },
      ],
    ],
    out: {
      ID: [
        'exp',
        'expOr',
        'expAnd',
        'expCompare',
        'expPlus',
        'expMult',
        'actualsList',
        'term',
        'id',
      ],
      INT: ['type', 'typeList'],
      'INT ID': ['varDecl', 'formals', 'formalDecl', 'stmt', '__type__id'],
    },
  },
  {
    in: [
      [
        {
          type: 'INT',
          data: {},
          simplePosition: 0,
        },
        {
          type: 'ID',
          data: {},
          simplePosition: 5,
        },
        {
          type: 'SEMICOL',
          data: {},
          simplePosition: 7,
        },
      ],
    ],
    out: {
      ID: [
        'exp',
        'expOr',
        'expAnd',
        'expCompare',
        'expPlus',
        'expMult',
        'actualsList',
        'term',
        'id',
      ],
      'ID SEMICOL': [],
      INT: ['type', 'typeList'],
      'INT ID': [
        'varDecl',
        'formals',
        'formalDecl',
        'stmt',
        '__type__id' as 'id',
      ],
      'INT ID SEMICOL': ['program', 'globals', 'stmtList'],
      SEMICOL: ['__SEMICOL' as 'id'],
    },
  },
]);

theories(powerSetIteratorCallback, [
  {
    in: [
      [
        {
          type: 'INT',
          data: {},
          simplePosition: 0,
        },
      ],
      () => error('should not be called'),
    ],
    out: ['type', 'typeList'],
  },
  {
    in: [
      [
        {
          type: 'INT',
          data: {},
          simplePosition: 0,
        },
        {
          type: 'ID',
          data: {},
          simplePosition: 5,
        },
      ],
      ([{ type }]: RA<Token>) =>
        type === 'INT'
          ? ['type', 'typeList']
          : ['exp', 'actualsList', 'term', 'id'],
    ],
    out: ['varDecl', 'formals', 'formalDecl', 'stmt', '__type__id' as 'id'],
  },
]);

theories(getInverseGrammarIndex, [
  {
    in: [{ a: [['a', 'b', 'c']], b: [['a']] }],
    out: {
      a: ['b'],
      'a b c': ['a'],
    },
  },
]);

theories(getCartesianProduct, [
  {
    in: [
      ['a', 'b'],
      ['1', '2'],
    ],
    out: [
      ['a', '1'],
      ['a', '2'],
      ['b', '1'],
      ['b', '2'],
    ],
  },
]);

theories(matchRulePairs, [
  {
    in: [[['fnDecl', 'fnDecl']]],
    out: [],
  },
  {
    in: [
      [
        ['stmt', '__SEMICOL' as 'id'],
        ['globals', 'fnDecl'],
      ],
    ],
    out: ['stmtList', 'program', 'globals'],
  },
]);
