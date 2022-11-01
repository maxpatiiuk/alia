import type { AstNode } from '../ast/definitions.js';
import {
  ActualsList,
  AssignmentExpression,
  AssignmentStatement,
  BooleanLiteralNode,
  BooleanOperator,
  ComparisonOperator,
  DecimalOperator,
  EqualityOperator,
  Expression,
  FormalDeclNode,
  FormalsDeclNode,
  ForNode,
  FunctionCall,
  FunctionCallStatement,
  FunctionDeclaration,
  FunctionTypeNode,
  GlobalsNode,
  IdNode,
  IfNode,
  InputNode,
  IntLiteralNode,
  MayhemNode,
  MinusNode,
  NotNode,
  OutputNode,
  PostNode,
  PrimaryTypeNode,
  ReturnNode,
  Statement,
  StatementList,
  StringLiteralNode,
  TokenNode,
  TypeListNode,
  TypeNode,
  VariableDeclaration,
  WhileNode,
} from '../ast/definitions.js';
import type { RA } from '../utils/types.js';
import { store } from '../utils/utils.js';
import { optimizeGrammar } from './optimize.js';
import { epsilon } from './utils.js';

function type<T extends AstNode, V extends RA<new (...args: RA<any>) => T>>(
  node: AstNode,
  ...types: V
): T {
  if (!types.some((type) => node instanceof type))
    throw new Error(
      `Unexpected child of type ${node.constructor.name}. ` +
        `Expected one of type ${types.map((type) => type.name).join(', ')}`
    );
  return node as T;
}

/**
 * A type-safe definition of a context-free grammar for Drewgon language
 * Need to wrap in store() to fix circular dependency
 */
export const grammar = store(() =>
  optimizeGrammar({
    /* eslint-disable @typescript-eslint/explicit-function-return-type */
    /* eslint-disable @typescript-eslint/naming-convention */
    program: [['globals', ({ globals }) => globals]],
    globals: [
      [
        'globals',
        'varDecl',
        'SEMICOL',
        ({ globals = new GlobalsNode([]), varDecl }) =>
          new GlobalsNode(
            [...(globals?.children ?? []), varDecl].map((node) =>
              type(
                node,
                VariableDeclaration,
                FunctionDeclaration,
                StatementList,
                Expression
              )
            )
          ),
      ],
      [
        'globals',
        'fnDecl',
        ({ globals = new GlobalsNode([]), fnDecl }) =>
          new GlobalsNode(
            [...(globals.children ?? []), fnDecl].map((node) =>
              type(
                node,
                VariableDeclaration,
                FunctionDeclaration,
                StatementList,
                Expression
              )
            )
          ),
      ],
      [
        'globals',
        'stmtList',
        'SEMICOL',
        ({ globals = new GlobalsNode([]), stmtList }) =>
          new GlobalsNode(
            [...(globals.children ?? []), stmtList].map((node) =>
              type(
                node,
                VariableDeclaration,
                FunctionDeclaration,
                StatementList,
                Expression
              )
            )
          ),
      ],
      [
        'globals',
        'exp',
        'SEMICOL',
        ({ globals = new GlobalsNode([]), exp }) =>
          new GlobalsNode(
            [...(globals.children ?? []), exp].map((node) =>
              type(
                node,
                VariableDeclaration,
                FunctionDeclaration,
                StatementList,
                Expression
              )
            )
          ),
      ],
      [...epsilon, () => new GlobalsNode([])],
    ],
    varDecl: [
      [
        'type',
        'id',
        ({ type: dataType, id }) =>
          new VariableDeclaration(type(dataType, TypeNode), type(id, IdNode)),
      ],
    ],
    type: [
      ['primType', ({ primType }) => primType],
      ['FN', 'fnType', ({ fnType }) => fnType],
    ],
    primType: [
      ['INT', ({ INT }) => new PrimaryTypeNode(type(INT, TokenNode))],
      ['BOOL', ({ BOOL }) => new PrimaryTypeNode(type(BOOL, TokenNode))],
      ['VOID', ({ VOID }) => new PrimaryTypeNode(type(VOID, TokenNode))],
    ],
    fnType: [
      [
        'LPAREN',
        'typeList',
        'RPAREN',
        'ARROW',
        'type',
        ({ typeList, type: returnType }) =>
          new FunctionTypeNode(type(typeList, TypeListNode), returnType),
      ],
      [
        'LPAREN',
        'RPAREN',
        'ARROW',
        'type',
        ({ type }) => new FunctionTypeNode(new TypeListNode([]), type),
      ],
    ],
    typeList: [
      ['type', ({ type }) => new TypeListNode([type])],
      [
        'typeList',
        'COMMA',
        'type',
        ({ typeList, type: argument }) =>
          new TypeListNode([
            ...type(typeList, TypeListNode).children,
            argument,
          ]),
      ],
    ],
    fnDecl: [
      [
        'type',
        'id',
        'LPAREN',
        'RPAREN',
        'LCURLY',
        'stmtList',
        'RCURLY',
        ({ type: returnType, id, stmtList = new StatementList([]) }) =>
          new FunctionDeclaration(
            type(returnType, TypeNode),
            type(id, IdNode),
            new FormalsDeclNode([]),
            type(stmtList, StatementList)
          ),
      ],
      [
        'type',
        'id',
        'LPAREN',
        'formals',
        'RPAREN',
        'LCURLY',
        'stmtList',
        'RCURLY',
        ({ type: returnType, id, formals, stmtList = new StatementList([]) }) =>
          new FunctionDeclaration(
            returnType,
            type(id, IdNode),
            type(formals, FormalsDeclNode),
            type(stmtList, StatementList)
          ),
      ],
    ],
    formals: [
      [
        'formalDecl',
        ({ formalDecl }) =>
          new FormalsDeclNode([type(formalDecl, FormalDeclNode)]),
      ],
      [
        'formals',
        'COMMA',
        'formalDecl',
        ({ formals, formalDecl }) =>
          new FormalsDeclNode(
            [...formals.children, formalDecl].map((node) =>
              type(node, FormalDeclNode)
            )
          ),
      ],
    ],
    formalDecl: [
      [
        'type',
        'id',
        ({ type: argumentType, id }) =>
          new FormalDeclNode(type(argumentType, TypeNode), type(id, IdNode)),
      ],
    ],
    stmtList: [
      [
        'stmtList',
        'stmt',
        'SEMICOL',
        ({ stmtList, stmt }) =>
          new StatementList(
            [...(stmtList?.children ?? []), stmt].map((node) =>
              type(node, Statement)
            )
          ),
      ],
      [
        'stmtList',
        'blockStmt',
        ({ stmtList, blockStmt }) =>
          new StatementList(
            [...(stmtList?.children ?? []), blockStmt].map((node) =>
              type(node, Statement)
            )
          ),
      ],
      [...epsilon, () => new StatementList([])],
    ],
    blockStmt: [
      [
        'WHILE',
        'LPAREN',
        'exp',
        'RPAREN',
        'LCURLY',
        'stmtList',
        'RCURLY',
        ({ WHILE, exp, stmtList = new StatementList([]) }) =>
          new WhileNode(
            type(WHILE, TokenNode),
            exp,
            type(stmtList, StatementList)
          ),
      ],
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
        ({ FOR, stmt, exp, stmt2, stmtList = new StatementList([]) }) =>
          new ForNode(
            type(FOR, TokenNode),
            stmt,
            exp,
            stmt2,
            type(stmtList, StatementList)
          ),
      ],
      [
        'IF',
        'LPAREN',
        'exp',
        'RPAREN',
        'LCURLY',
        'stmtList',
        'RCURLY',
        ({ IF, exp, stmtList = new StatementList([]) }) =>
          new IfNode(
            type(IF, TokenNode),
            exp,
            type(stmtList, StatementList),
            undefined
          ),
      ],
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
        ({
          IF,
          exp,
          stmtList = new StatementList([]),
          stmtList2 = new StatementList([]),
        }) =>
          new IfNode(
            type(IF, TokenNode),
            exp,
            type(stmtList, StatementList),
            type(stmtList2, StatementList) as StatementList
          ),
      ],
    ],
    stmt: [
      [
        'assignExp',
        ({ assignExp }) =>
          new AssignmentStatement(type(assignExp, AssignmentExpression)),
      ],
      [
        'callExp',
        ({ callExp }) => new FunctionCallStatement(type(callExp, FunctionCall)),
      ],
      ['varDecl', ({ varDecl }) => varDecl],
      ['id', 'POSTDEC', ({ id }) => new PostNode(type(id, IdNode), '--')],
      ['id', 'POSTINC', ({ id }) => new PostNode(type(id, IdNode), '++')],
      [
        'INPUT',
        'id',
        ({ INPUT, id }) =>
          new InputNode(type(INPUT, TokenNode), type(id, IdNode)),
      ],
      [
        'OUTPUT',
        'exp',
        ({ OUTPUT, exp }) => new OutputNode(type(OUTPUT, TokenNode), exp),
      ],
      [
        'RETURN',
        ({ RETURN }) => new ReturnNode(type(RETURN, TokenNode), undefined),
      ],
      ['returnExp', ({ returnExp }) => returnExp],
    ],
    returnExp: [
      [
        'RETURN',
        'exp',
        ({ RETURN, exp }) => new ReturnNode(type(RETURN, TokenNode), exp),
      ],
    ],
    exp: [
      ['assignExp', ({ assignExp }) => assignExp],
      ['NOT', 'exp', ({ NOT, exp }) => new NotNode(type(NOT, TokenNode), exp)],
      [
        'MINUS',
        'term',
        ({ MINUS, term }) => new MinusNode(type(MINUS, TokenNode), term),
      ],
      ['expOr', ({ expOr }) => expOr],
    ],
    expOr: [
      [
        'expAnd',
        'OR',
        'expOr',
        ({ expAnd, OR, expOr }) =>
          new BooleanOperator(expAnd, type(OR, TokenNode), expOr),
      ],
      ['expAnd', ({ expAnd }) => expAnd],
    ],
    expAnd: [
      [
        'expCompare',
        'AND',
        'expAnd',
        ({ expCompare, AND, expAnd }) =>
          new BooleanOperator(expCompare, type(AND, TokenNode), expAnd),
      ],
      ['expCompare', ({ expCompare }) => expCompare],
    ],
    expCompare: [
      [
        'expPlus',
        'EQUALS',
        'expCompare',
        ({ expPlus, EQUALS, expCompare }) =>
          new EqualityOperator(expPlus, type(EQUALS, TokenNode), expCompare),
      ],
      [
        'expPlus',
        'NOTEQUALS',
        'expCompare',
        ({ expPlus, NOTEQUALS, expCompare }) =>
          new EqualityOperator(expPlus, type(NOTEQUALS, TokenNode), expCompare),
      ],
      [
        'expPlus',
        'GREATER',
        'expCompare',
        ({ expPlus, GREATER, expCompare }) =>
          new ComparisonOperator(expPlus, type(GREATER, TokenNode), expCompare),
      ],
      [
        'expPlus',
        'GREATEREQ',
        'expCompare',
        ({ expPlus, GREATEREQ, expCompare }) =>
          new ComparisonOperator(
            expPlus,
            type(GREATEREQ, TokenNode),
            expCompare
          ),
      ],
      [
        'expPlus',
        'LESS',
        'expCompare',
        ({ expPlus, LESS, expCompare }) =>
          new ComparisonOperator(expPlus, type(LESS, TokenNode), expCompare),
      ],
      [
        'expPlus',
        'LESSEQ',
        'expCompare',
        ({ expPlus, LESSEQ, expCompare }) =>
          new ComparisonOperator(expPlus, type(LESSEQ, TokenNode), expCompare),
      ],
      ['expPlus', ({ expPlus }) => expPlus],
    ],
    expPlus: [
      [
        'expMult',
        'MINUS',
        'expPlus',
        ({ expMult, MINUS, expPlus }) =>
          new DecimalOperator(expMult, type(MINUS, TokenNode), expPlus),
      ],
      [
        'expMult',
        'PLUS',
        'expPlus',
        ({ expMult, PLUS, expPlus }) =>
          new DecimalOperator(expMult, type(PLUS, TokenNode), expPlus),
      ],
      ['expMult', ({ expMult }) => expMult],
    ],
    expMult: [
      [
        'term',
        'TIMES',
        'expMult',
        ({ term, TIMES, expMult }) =>
          new DecimalOperator(term, type(TIMES, TokenNode), expMult),
      ],
      [
        'term',
        'DIVIDE',
        'expMult',
        ({ term, DIVIDE, expMult }) =>
          new DecimalOperator(term, type(DIVIDE, TokenNode), expMult),
      ],
      ['term', ({ term }) => term],
    ],
    assignExp: [
      [
        'id',
        'ASSIGN',
        'exp',
        ({ id, ASSIGN, exp }) =>
          new AssignmentExpression(
            type(id, IdNode),
            type(ASSIGN, TokenNode),
            exp
          ),
      ],
    ],
    callExp: [
      [
        'id',
        'LPAREN',
        'RPAREN',
        ({ id, RPAREN }) =>
          new FunctionCall(
            type(id, IdNode),
            new ActualsList([]),
            type(RPAREN, TokenNode)
          ),
      ],
      [
        'id',
        'LPAREN',
        'actualsList',
        'RPAREN',
        ({ id, actualsList, RPAREN }) =>
          new FunctionCall(
            type(id, IdNode),
            type(actualsList, ActualsList),
            type(RPAREN, TokenNode)
          ),
      ],
    ],
    actualsList: [
      ['exp', ({ exp }) => new ActualsList([type(exp, Expression)])],
      [
        'actualsList',
        'COMMA',
        'exp',
        ({ actualsList, exp }) =>
          new ActualsList([...actualsList.children, type(exp, Expression)]),
      ],
    ],
    term: [
      ['id', ({ id }) => type(id, IdNode)],
      [
        'INTLITERAL',
        ({ INTLITERAL }) => new IntLiteralNode(type(INTLITERAL, TokenNode)),
      ],
      [
        'STRINGLITERAL',
        ({ STRINGLITERAL }) =>
          new StringLiteralNode(type(STRINGLITERAL, TokenNode)),
      ],
      ['TRUE', ({ TRUE }) => new BooleanLiteralNode(type(TRUE, TokenNode))],
      ['FALSE', ({ FALSE }) => new BooleanLiteralNode(type(FALSE, TokenNode))],
      ['LPAREN', 'exp', 'RPAREN', ({ exp }) => exp],
      ['callExp', ({ callExp }) => callExp],
      ['MAYHEM', ({ MAYHEM }) => new MayhemNode(type(MAYHEM, TokenNode))],
    ],
    id: [['ID', ({ ID }) => new IdNode(type(ID, TokenNode))]],
    /*
     * This rule will never get called. It is here just to simplify TypeScript
     * typing
     */
    [epsilon[0]]: [['program']],
    /* eslint-enable @typescript-eslint/explicit-function-return-type */
    /* eslint-enable @typescript-eslint/naming-convention */
  } as const)
);

export type GrammarKey = keyof ReturnType<typeof grammar>;
