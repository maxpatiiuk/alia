import type { Tokens } from '../tokenize/tokens.js';
import type { RA, RR } from '../utils/types.js';
import { store } from '../utils/utils.js';
import { findGrammarRoot } from './chomsky/uselessRules.js';
import { optimizeGrammar } from './optimizeGrammar/index.js';

export type AbstractGrammar<T extends string> = RR<
  T,
  RA<AbstractGrammarLine<T>>
>;

export type AbstractGrammarLine<T extends string> = RA<T | keyof Tokens>;

export const epsilon = ['__'] as const;
export const typeFixRule = '_' as string;

// TODO: detect and fix the ambiguity errors
// TODO: enforce left/right associativity as appropriate
/**
 * A type-safe definition of a context-free grammar for Drewgon language
 * Need to wrap in store() to fix circular dependency
 */
export const grammar = store(() =>
  optimizeGrammar({
    program: [['globals']],
    globals: [
      ['globals', 'varDecl', 'SEMICOL'],
      ['globals', 'fnDecl'],
      epsilon,
    ],
    varDecl: [['type', 'id']],
    type: [['primType'], ['FN', 'fnType']],
    primType: [['INT'], ['BOOL'], ['VOID']],
    fnType: [
      ['LPAREN', 'typeList', 'RPAREN', 'ARROW', 'type'],
      ['LPAREN', 'RPAREN', 'ARROW', 'type'],
    ],
    typeList: [['type'], ['typeList', 'COMMA', 'type']],
    fnDecl: [
      ['type', 'id', 'LPAREN', 'RPAREN', 'LCURLY', 'stmtList', 'RCURLY'],
      [
        'type',
        'id',
        'LPAREN',
        'formals',
        'RPAREN',
        'LCURLY',
        'stmtList',
        'RCURLY',
      ],
    ],
    formals: [['formalDecl'], ['formals', 'COMMA', 'formalDecl']],
    formalDecl: [['type', 'id']],
    stmtList: [
      ['stmtList', 'stmt', 'SEMICOL'],
      ['stmtList', 'blockStmt'],
      epsilon,
    ],
    blockStmt: [
      ['WHILE', 'LPAREN', 'exp', 'RPAREN', 'LCURLY', 'stmtList', 'RCURLY'],
      [
        'FOR',
        'LPAREN',
        'stmt',
        'SEMICOL',
        'exp',
        'SEMICOL',
        'stmt',
        'RPAREN',
        'LCURLY',
        'stmtList',
        'RCURLY',
      ],
      ['IF', 'LPAREN', 'exp', 'RPAREN', 'LCURLY', 'stmtList', 'RCURLY'],
      [
        'IF',
        'LPAREN',
        'exp',
        'RPAREN',
        'LCURLY',
        'stmtList',
        'RCURLY',
        'ELSE',
        'LCURLY',
        'stmtList',
        'RCURLY',
      ],
    ],
    stmt: [
      ['varDecl'],
      ['assignExp'],
      ['id', 'POSTDEC'],
      ['id', 'POSTINC'],
      ['INPUT', 'id'],
      ['OUTPUT', 'exp'],
      ['RETURN', 'exp'],
      ['RETURN'],
      ['callExp'],
    ],
    exp: [
      ['assignExp'],
      ['exp', 'MINUS', 'exp'],
      ['exp', 'PLUS', 'exp'],
      ['exp', 'TIMES', 'exp'],
      ['exp', 'DIVIDE', 'exp'],
      ['exp', 'AND', 'exp'],
      ['exp', 'OR', 'exp'],
      ['exp', 'EQUALS', 'exp'],
      ['exp', 'NOTEQUALS', 'exp'],
      ['exp', 'GREATER', 'exp'],
      ['exp', 'GREATEREQ', 'exp'],
      ['exp', 'LESS', 'exp'],
      ['exp', 'LESSEQ', 'exp'],
      ['NOT', 'exp'],
      ['MINUS', 'term'],
      ['term'],
    ],
    assignExp: [['id', 'ASSIGN', 'exp']],
    callExp: [
      ['id', 'LPAREN', 'RPAREN'],
      ['id', 'LPAREN', 'actualsList', 'RPAREN'],
    ],
    actualsList: [['exp'], ['actualsList', 'COMMA', 'exp']],
    term: [
      ['id'],
      ['INTLITERAL'],
      ['STRINGLITERAL'],
      ['TRUE'],
      ['FALSE'],
      ['LPAREN', 'exp', 'RPAREN'],
      ['callExp'],
    ],
    id: [['ID']],
    // These rules are just to simplify TypeScript typing:
    [epsilon[0]]: [],
    /*
     * Current typing does not allow a type that is not reference anywhere
     * That is why this fake rule is added
     */
    [typeFixRule]: [[typeFixRule, 'program']],
  } as const)
);

export type GrammarKey = keyof ReturnType<typeof grammar>;

export const grammarRoot = store(() => findGrammarRoot(grammar()));
