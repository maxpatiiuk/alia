import { simpleTokens } from '../tokenize/definitions.js';
import type { Tokens } from '../tokenize/tokens.js';
import type { Token } from '../tokenize/types.js';
import { indentation } from '../unparseParseTree/index.js';
import type { RA, WritableArray } from '../utils/types.js';
import type { LanguageType, typeErrors } from './typing.js';
import {
  assertType,
  BoolType,
  cascadeError,
  ErrorType,
  FunctionType,
  IntType,
  StringType,
  VoidType,
} from './typing.js';

/* eslint-disable class-methods-use-this */
/* eslint-disable functional/no-class */
/* eslint-disable functional/no-this-expression */
/* eslint-disable functional/prefer-readonly-type */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable functional/no-throw-statement */

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export abstract class AstNode {
  public nameAnalysisContext: NameAnalysisContext;

  public readonly declarations: WritableArray<
    FunctionDeclaration | VariableDeclaration
  >;

  public constructor(public readonly children: RA<AstNode>) {
    this.declarations = [];
    this.nameAnalysisContext = {
      symbolTable: [],
      isDeclaration: false,
      reportError: (_idNode, error) => {
        throw new Error(error);
      },
    };
  }

  /**
   * Run Name Analysis on an AST subtree
   */
  public nameAnalysis(context: NameAnalysisContext): void {
    this.nameAnalysisContext = context;

    this.children.forEach((child) => child.nameAnalysis(context));
  }

  /**
   * Traverse the AST and return the type of each node while also reporting
   * any type errors found in the process
   */
  public typeCheck(_context: TypeCheckContext): LanguageType {
    throw new Error('TypeChecker is not declared');
  }

  /**
   * A decorator for the pretty() method that enables additional output
   * when in debug mode (useful for debugging the unparser formatting)
   */
  public print(printContext: PrintContext): string {
    const formatted = this.pretty(printContext);
    const debug = printContext.debug ? `<${this.constructor.name}:` : '';
    return `${debug}${
      Array.isArray(formatted) ? formatted.join('') : formatted
    }${printContext.debug ? '>' : ''}`;
  }

  public pretty(printContext: PrintContext): RA<string> | string {
    return this.children.map((part) => part.print(printContext));
  }

  /**
   * Return a string that represents a stringified TypeNode. Useful when doing
   * unparse with type anotations enabled
   */
  public printType(_printContext: PrintContext): string {
    throw new Error('PrintType is not implemented');
  }

  /**
   * Get a token node. If any type error occurs in this AstNode, the error
   * would be reported at the position of this token.
   */
  public getToken(): TokenNode {
    throw new Error('getToken is not implemented');
  }
}

export type NameAnalysisContext = {
  readonly symbolTable: RA<Scope>;
  // If IdNode is used inside a declaration, supress undefined identifier errors
  readonly isDeclaration: boolean;
  readonly reportError: (idNode: IdNode, message: string) => void;
};

export type TypeCheckContext = {
  readonly reportError: (
    node: AstNode,
    message: keyof typeof typeErrors
  ) => ErrorType;
};

type Scope = {
  readonly items: RA<FunctionDeclaration | VariableDeclaration>;
  readonly node:
    | ForNode
    | FunctionDeclaration
    | GlobalsNode
    | IfNode
    | WhileNode;
  readonly addItem: (
    item: FunctionDeclaration | VariableDeclaration,
    dry?: boolean
  ) => void;
};

export type PrintContext = {
  readonly indent: number;
  readonly mode: 'nameAnalysis' | 'pretty';
  readonly debug: boolean;
  // Whether expression needs to be wrapped in parentheses just to be safe
  readonly needWrapping: boolean;
};

const indexedSimpleTokens = Object.fromEntries(simpleTokens);

export class TokenNode extends AstNode {
  public constructor(public readonly token: Token) {
    super([]);
  }

  public pretty() {
    return indexedSimpleTokens[this.token.type];
  }

  public toString() {
    if (this.token.type === 'ID')
      return (this.token.data as Tokens['ID']).literal.toString();
    else if (this.token.type === 'INTLITERAL')
      return (this.token.data as Tokens['INTLITERAL']).literal.toString();
    else if (this.token.type === 'STRINGLITERAL')
      return (this.token.data as Tokens['STRINGLITERAL']).literal.toString();
    else return this.pretty();
  }

  public getToken() {
    return this;
  }
}

export class GlobalsNode extends AstNode {
  public constructor(
    public readonly children: RA<FunctionDeclaration | VariableDeclaration>
  ) {
    super([]);
  }

  public pretty(printContext: PrintContext) {
    return this.children.flatMap((child, index, { length }) => [
      child.print(printContext),
      child instanceof FunctionDeclaration ? '' : `${token('SEMICOL')}`,
      index + 1 === length ? '' : '\n',
    ]);
  }

  public typeCheck(context: TypeCheckContext): LanguageType {
    this.children.forEach((child) => child.typeCheck(context));
    return new VoidType();
  }
}

export class Statement extends AstNode {}

function getScope(node: AstNode) {
  const currentScope = node.nameAnalysisContext.symbolTable.at(-1);
  if (currentScope === undefined)
    throw new Error('Trying to declare a function outside of scope');
  else return currentScope;
}

export class VariableDeclaration extends Statement {
  public constructor(
    public readonly type: TypeNode,
    public readonly id: IdNode
  ) {
    super([type, id]);
  }

  public nameAnalysis(context: NameAnalysisContext) {
    super.nameAnalysis({ ...context, isDeclaration: true });
    if (
      this.type instanceof PrimaryTypeNode &&
      this.type.token.token.type === 'VOID'
    ) {
      this.nameAnalysisContext.reportError(
        this.id,
        'Invalid type in declaration'
      );
      getScope(this).addItem(this, true);
    } else getScope(this).addItem(this);
  }

  public getToken() {
    return this.id.getToken();
  }

  public pretty(printContext: PrintContext) {
    return [this.type.print(printContext), ' ', this.id.print(printContext)];
  }

  public printType(printContext: PrintContext) {
    return this.id.printType(printContext);
  }

  public typeCheck(_context: TypeCheckContext): LanguageType {
    return new VoidType();
  }
}

export class TypeNode extends AstNode {}

export class PrimaryTypeNode extends TypeNode {
  public constructor(public readonly token: TokenNode) {
    super([token]);
  }

  public printType(printContext: PrintContext) {
    return this.print(printContext);
  }

  public typeCheck(_context: TypeCheckContext): LanguageType {
    const type = this.token.token.type;
    if (type === 'INT') return new IntType();
    else if (type === 'BOOL') return new BoolType();
    else if (type === 'VOID') return new VoidType();
    else throw new Error(`Unexpected type ${type} detected`);
  }
}

export class Expression extends AstNode {}

export class Term extends Expression {}

const findDeclaration = (
  name: string,
  context: NameAnalysisContext
): FunctionDeclaration | VariableDeclaration | undefined =>
  Array.from(context.symbolTable)
    .reverse()
    .flatMap(({ items }) => items)
    .find((item) => item.id.getName() === name);

export class IdNode extends Term {
  public constructor(public readonly token: TokenNode) {
    super([token]);
  }

  public getName(): string {
    return (this.token.token.data as Tokens['ID']).literal.toString();
  }

  public getToken() {
    return this.token.getToken();
  }

  public typeCheck(_context: TypeCheckContext) {
    const declaration = this.getDeclaration();
    if (declaration === undefined)
      throw new Error(`Unable to find ${this.getName()} variable declaration`);
    else if (declaration instanceof FunctionDeclaration)
      return declaration.typeNode;
    else if (declaration.type instanceof FunctionTypeNode)
      return declaration.type.typeNode;
    else if (declaration.type instanceof PrimaryTypeNode) {
      const type = declaration.type.token.token.type;
      if (type === 'INT') return new IntType();
      else if (type === 'BOOL') return new BoolType();
      else
        throw new Error(`Variable ${this.getName()} has invalid type ${type}`);
    } else throw new Error(`Variable ${this.getName()} has unknown type`);
  }

  public nameAnalysis(context: NameAnalysisContext) {
    super.nameAnalysis(context);
    if (context.isDeclaration) return;
    if (this.getDeclaration() === undefined)
      this.nameAnalysisContext.reportError(this, 'Undeclared identifier');
  }

  private getDeclaration():
    | FunctionDeclaration
    | VariableDeclaration
    | undefined {
    return findDeclaration(this.getName(), this.nameAnalysisContext);
  }

  public pretty(printContext: PrintContext) {
    return [
      this.getName(),
      printContext.mode === 'nameAnalysis' ? this.printType(printContext) : '',
    ];
  }

  public printType(printContext: PrintContext): string {
    return [
      token('LPAREN'),
      this.getDeclaration()!.type.printType(printContext),
      token('RPAREN'),
    ].join('');
  }
}

const token = (token: keyof Tokens) => indexedSimpleTokens[token];

export class FunctionTypeNode extends TypeNode {
  public readonly typeNode: FunctionType;

  public constructor(
    public readonly typeList: TypeListNode,
    public readonly returnType: TypeNode
  ) {
    super([typeList, returnType]);
    this.typeNode = new FunctionType(this);
  }

  public pretty(printContext: PrintContext) {
    return [
      token('FN'),
      ' ',
      token('LPAREN'),
      this.typeList.print(printContext),
      token('RPAREN'),
      token('ARROW'),
      this.returnType.print(printContext),
    ];
  }

  public printType(printContext: PrintContext) {
    return [
      this.typeList.printType(printContext),
      token('ARROW'),
      this.returnType.printType(printContext),
    ].join('');
  }

  public typeCheck(_context: TypeCheckContext): LanguageType {
    return this.typeNode;
  }
}

export class TypeListNode extends TypeNode {
  public constructor(public readonly children: RA<TypeNode>) {
    super(children);
  }

  public pretty(printContext: PrintContext) {
    return this.children
      .map((child) => child.print(printContext))
      .join(`${token('COMMA')} `);
  }

  public printType(printContext: PrintContext): string {
    return this.children
      .map((child) => child.printType(printContext))
      .join(token('COMMA'));
  }

  public typeCheck(context: TypeCheckContext): LanguageType {
    this.children.forEach((child) => child.typeCheck(context));
    return new VoidType();
  }
}

function indent(printContext: PrintContext, node: AstNode): string {
  const newContext = { ...printContext, indent: printContext.indent + 1 };
  const content = node.print(newContext);
  return [
    token('LCURLY'),
    '\n',
    content,
    content.length === 0 ? '' : '\n',
    indentation.repeat(printContext.indent),
    token('RCURLY'),
  ].join('');
}

/**
 * Call this to receive a new scope that can be added to the SymbolTable.
 */
export const createScope = (
  node: ForNode | FunctionDeclaration | GlobalsNode | IfNode | WhileNode
): Scope => ({
  items: node.declarations,
  node,
  addItem: (item, dry) => {
    const itemName = item.id.getName();
    const duplicateIdentifier = node.declarations.find(
      (declaration) => declaration.id.getName() === itemName
    );
    if (typeof duplicateIdentifier === 'object')
      node.nameAnalysisContext.reportError(
        item.id,
        'Multiply declared identifier'
      );
    else if (dry !== true) node.declarations.push(item);
  },
});

export class FunctionDeclaration extends AstNode {
  public readonly typeNode: FunctionType;

  public returnType: LanguageType;

  public constructor(
    public readonly type: TypeNode,
    public readonly id: IdNode,
    public readonly formals: FormalsDeclNode,
    private readonly statements: StatementList
  ) {
    super([type, id, formals, statements]);
    this.typeNode = new FunctionType(
      new FunctionTypeNode(
        new TypeListNode(this.formals.children.map(({ type }) => type)),
        this.type
      )
    );
    this.returnType = new ErrorType();
  }

  public nameAnalysis(context: NameAnalysisContext) {
    this.nameAnalysisContext = context;
    getScope(this).addItem(this);
    this.type.nameAnalysis(context);
    this.id.nameAnalysis({ ...context, isDeclaration: true });
    const newScope = {
      ...context,
      symbolTable: [...context.symbolTable, createScope(this)],
    };
    this.formals.nameAnalysis(newScope);
    this.statements.nameAnalysis(newScope);
  }

  public typeCheck(context: TypeCheckContext) {
    this.returnType = this.type.typeCheck(context);
    const cascadeType = cascadeError(
      this.returnType,
      this.id.typeCheck(context),
      this.formals.typeCheck(context),
      this.statements.typeCheck(context)
    );
    return cascadeType instanceof Error ? cascadeType : this.typeNode;
  }

  public pretty(printContext: PrintContext) {
    return [
      this.type.print(printContext),
      ' ',
      this.id.print({ ...printContext, mode: 'pretty' }),
      printContext.mode === 'nameAnalysis' ? this.printType(printContext) : '',
      token('LPAREN'),
      this.formals.print(printContext),
      token('RPAREN'),
      indent(printContext, this.statements),
    ];
  }

  public getToken() {
    return this.id.getToken();
  }

  public printType(printContext: PrintContext): string {
    return [
      token('LPAREN'),
      this.formals.printType(printContext),
      token('ARROW'),
      this.type.printType(printContext),
      token('RPAREN'),
    ].join('');
  }
}

export class FormalsDeclNode extends AstNode {
  public constructor(public readonly children: RA<FormalDeclNode>) {
    super(children);
  }

  public pretty(printContext: PrintContext) {
    return this.children
      .map((child) => child.print(printContext))
      .join(`${token('COMMA')} `);
  }

  public printType(printContext: PrintContext) {
    return this.children
      .map((child) => child.type.printType(printContext))
      .join(',');
  }

  public typeCheck(_context: TypeCheckContext): LanguageType {
    return new VoidType();
  }
}

export class FormalDeclNode extends VariableDeclaration {}

export class StatementList extends AstNode {
  public constructor(public readonly children: RA<Statement>) {
    super(children);
  }

  public pretty(printContext: PrintContext) {
    return this.children.flatMap((child, index, { length }) => [
      indentation.repeat(printContext.indent),
      child.print(printContext),
      child instanceof BlockStatement ? '' : token('SEMICOL'),
      index + 1 === length ? '' : '\n',
    ]);
  }

  public typeCheck(context: TypeCheckContext): LanguageType {
    this.children.forEach((child) => child.typeCheck(context));
    return new VoidType();
  }
}

export class BlockStatement extends Statement {}

export class WhileNode extends BlockStatement {
  public constructor(
    private readonly token: TokenNode,
    public readonly condition: Expression,
    public readonly statements: StatementList
  ) {
    super([condition, statements]);
  }

  public nameAnalysis(context: NameAnalysisContext) {
    this.nameAnalysisContext = context;
    this.condition.nameAnalysis(context);
    const newScope = {
      ...context,
      symbolTable: [...context.symbolTable, createScope(this)],
    };
    this.statements.nameAnalysis(newScope);
  }

  public typeCheck(context: TypeCheckContext) {
    return cascadeError(
      assertType(context, this.condition, 'nonBoolLoop', 'bool'),
      this.statements.typeCheck(context)
    );
  }

  public pretty(printContext: PrintContext) {
    return [
      token('WHILE'),
      ' ',
      token('LPAREN'),
      this.condition.print(printContext),
      token('RPAREN'),
      indent(printContext, this.statements),
    ];
  }

  public getToken() {
    return this.token;
  }
}

export class ForNode extends BlockStatement {
  public constructor(
    private readonly token: TokenNode,
    public readonly declaration: Statement,
    public readonly condition: Expression,
    public readonly action: Statement,
    public readonly statements: StatementList
  ) {
    super([declaration, condition, action, statements]);
  }

  public nameAnalysis(context: NameAnalysisContext) {
    this.nameAnalysisContext = context;
    const newScope = {
      ...context,
      symbolTable: [...context.symbolTable, createScope(this)],
    };
    this.declaration.nameAnalysis(newScope);
    this.condition.nameAnalysis(newScope);
    const fullStatements = new StatementList([
      ...this.statements.children,
      this.action,
    ]);
    fullStatements.nameAnalysis(newScope);
  }

  public typeCheck(context: TypeCheckContext) {
    return cascadeError(
      this.declaration.typeCheck(context),
      assertType(context, this.condition, 'nonBoolLoop', 'bool'),
      this.action.typeCheck(context),
      this.statements.typeCheck(context)
    );
  }

  public pretty(printContext: PrintContext) {
    return [
      token('FOR'),
      ' ',
      token('LPAREN'),
      this.declaration.print(printContext),
      token('SEMICOL'),
      ' ',
      this.condition.print(printContext),
      token('SEMICOL'),
      ' ',
      this.action.print(printContext),
      token('RPAREN'),
      indent(printContext, this.statements),
    ];
  }

  public getToken() {
    return this.token;
  }
}

export class IfNode extends BlockStatement {
  public constructor(
    private readonly token: TokenNode,
    public readonly condition: Expression,
    public readonly statements: StatementList,
    public readonly elseStatements: StatementList | undefined
  ) {
    super([
      condition,
      statements,
      ...(elseStatements === undefined ? [] : [elseStatements]),
    ]);
  }

  public nameAnalysis(context: NameAnalysisContext) {
    this.nameAnalysisContext = context;
    this.condition.nameAnalysis(context);
    const newScope = {
      ...context,
      symbolTable: [...context.symbolTable, createScope(this)],
    };
    this.statements.nameAnalysis(newScope);
    if (typeof this.elseStatements === 'object') {
      const newScope = {
        ...context,
        symbolTable: [...context.symbolTable, createScope(this)],
      };
      this.elseStatements.nameAnalysis(newScope);
    }
  }

  public typeCheck(context: TypeCheckContext) {
    return cascadeError(
      assertType(context, this.condition, 'nonBoolIf', 'bool'),
      this.statements.typeCheck(context),
      this.elseStatements?.typeCheck(context)
    );
  }

  public pretty(printContext: PrintContext) {
    return [
      token('IF'),
      ' ',
      token('LPAREN'),
      this.condition.print(printContext),
      token('RPAREN'),
      indent(printContext, this.statements),
      ...(this.elseStatements === undefined
        ? []
        : [' ', token('ELSE'), ' ', indent(printContext, this.elseStatements)]),
    ];
  }

  public getToken() {
    return this.token;
  }
}

export class LineStatement extends Statement {}

export class PostNode extends LineStatement {
  public constructor(
    public readonly id: IdNode,
    public readonly type: '--' | '++'
  ) {
    super([id]);
  }

  public typeCheck(context: TypeCheckContext) {
    return assertType(context, this.id, 'nonIntArith', 'int');
  }

  public getToken() {
    return this.id.getToken();
  }

  public pretty(printContext: PrintContext) {
    return [this.id.print(printContext), this.type];
  }
}

export class InputNode extends LineStatement {
  public constructor(
    private readonly token: TokenNode,
    public readonly id: IdNode
  ) {
    super([id]);
  }

  public typeCheck(context: TypeCheckContext) {
    return assertType(context, this.id, 'inputOnFunction', 'int', 'bool');
  }

  public pretty(printContext: PrintContext) {
    return [token('INPUT'), ' ', this.id.print(printContext)];
  }

  public getToken() {
    return this.token;
  }
}

export class OutputNode extends LineStatement {
  public constructor(
    private readonly token: TokenNode,
    public readonly expression: Expression
  ) {
    super([expression]);
  }

  public typeCheck(context: TypeCheckContext) {
    const type = this.expression.typeCheck(context);
    if (type instanceof FunctionType)
      return context.reportError(this.expression, 'outputOnFunction');
    else if (type instanceof VoidType)
      return context.reportError(this.expression, 'outputOnVoid');
    else return type;
  }

  public pretty(printContext: PrintContext) {
    return [token('OUTPUT'), ' ', this.expression.print(printContext)];
  }

  public getToken() {
    return this.token;
  }
}

export class ReturnNode extends LineStatement {
  public constructor(
    private readonly token: TokenNode,
    public readonly expression: Expression | undefined
  ) {
    super(expression === undefined ? [] : [expression]);
  }

  public typeCheck(context: TypeCheckContext): LanguageType {
    const functionDecl = Array.from(this.nameAnalysisContext.symbolTable)
      .reverse()
      .find(({ node }) => node instanceof FunctionDeclaration)?.node;
    if (!(functionDecl instanceof FunctionDeclaration))
      throw new Error('Return used outside of function');
    const actualReturnType = this.expression?.typeCheck(context);
    if (actualReturnType instanceof ErrorType) return actualReturnType;
    const returnType = functionDecl.returnType;
    if (actualReturnType === undefined) {
      return returnType instanceof VoidType
        ? returnType
        : context.reportError(this, 'noReturn');
    } else if (
      actualReturnType.toString() === returnType.toString() &&
      !(returnType instanceof VoidType)
    )
      return actualReturnType;
    else
      return context.reportError(
        this.expression ?? this,
        returnType instanceof VoidType ? 'voidReturn' : 'wrongReturn'
      );
  }

  public pretty(printContext: PrintContext) {
    return [
      token('RETURN'),
      ...(this.expression ? [' ', this.expression.print(printContext)] : []),
    ];
  }

  public getToken() {
    return this.token;
  }
}

const wrapChild = (printContext: PrintContext, node: AstNode) =>
  node.print({ ...printContext, needWrapping: true });

const wrap = (
  printContext: PrintContext,
  output: RA<string>
): RA<string> | string =>
  printContext.needWrapping
    ? [token('LPAREN'), ...output, token('RPAREN')]
    : output;

function assertToken<TOKENS extends keyof Tokens, PRINT extends string>(
  { token }: TokenNode,
  ...expected: RA<TOKENS>
): PRINT {
  if (expected.includes(token.type as TOKENS))
    return indexedSimpleTokens[token.type] as PRINT;
  else
    throw new Error(
      `Invalid token type ${token.type}. Expected one of ${expected.join(', ')}`
    );
}

export class DecimalOperator extends Expression {
  public readonly operator: '-' | '*' | '/' | '+';

  public readonly token: TokenNode;

  public constructor(
    public readonly left: Expression,
    token: TokenNode,
    public readonly right: Expression
  ) {
    super([left, right]);
    this.operator = assertToken(token, 'MINUS', 'TIMES', 'DIVIDE', 'PLUS');
    this.token = token;
  }

  public typeCheck(context: TypeCheckContext) {
    return cascadeError(
      assertType(context, this.left, 'nonIntArith', 'int'),
      assertType(context, this.right, 'nonIntArith', 'int')
    );
  }

  public pretty(printContext: PrintContext) {
    return wrap(printContext, [
      wrapChild(printContext, this.left),
      ' ',
      this.operator,
      ' ',
      wrapChild(printContext, this.right),
    ]);
  }

  public getToken() {
    return this.token;
  }
}

export class BooleanOperator extends Expression {
  public readonly operator: 'and' | 'or';

  public readonly token: TokenNode;

  public constructor(
    public readonly left: Expression,
    token: TokenNode,
    public readonly right: Expression
  ) {
    super([left, right]);
    this.operator = assertToken(token, 'AND', 'OR');
    this.token = token;
  }

  public typeCheck(context: TypeCheckContext) {
    return cascadeError(
      assertType(context, this.left, 'nonBoolLogic', 'bool'),
      assertType(context, this.right, 'nonBoolLogic', 'bool')
    );
  }

  public pretty(printContext: PrintContext) {
    return wrap(printContext, [
      wrapChild(printContext, this.left),
      ' ',
      this.operator,
      ' ',
      wrapChild(printContext, this.right),
    ]);
  }

  public getToken() {
    return this.token;
  }
}

class SynteticToken extends TokenNode {
  public constructor(startNode: AstNode) {
    super({
      type: 'VOID',
      data: {},
      position: startNode.getToken().token.position,
    });
  }
}

export class EqualityOperator extends Expression {
  public readonly operator: '!=' | '==';

  public readonly token: TokenNode;

  public constructor(
    public readonly left: Expression,
    token: TokenNode,
    public readonly right: Expression
  ) {
    super([left, right]);
    this.operator = assertToken(token, 'EQUALS', 'NOTEQUALS');
    this.token = token;
  }

  public typeCheck(context: TypeCheckContext): LanguageType {
    const leftType = assertType(
      context,
      this.left,
      'invalidEqOperand',
      'int',
      'bool'
    );
    const rightType = assertType(
      context,
      this.right,
      'invalidEqOperand',
      'int',
      'bool'
    );
    const cascadeType = cascadeError(leftType, rightType);
    return !(cascadeType instanceof ErrorType) &&
      leftType.toString() !== rightType.toString()
      ? context.reportError(this, 'invalidEqOperation')
      : new BoolType();
  }

  public pretty(printContext: PrintContext) {
    return wrap(printContext, [
      wrapChild(printContext, this.left),
      ' ',
      this.operator,
      ' ',
      wrapChild(printContext, this.right),
    ]);
  }

  public getToken() {
    return new SynteticToken(this.left).getToken();
  }
}

export class ComparisonOperator extends Expression {
  public readonly operator: '<' | '<=' | '>' | '>=';

  public readonly token: TokenNode;

  public constructor(
    public readonly left: Expression,
    token: TokenNode,
    public readonly right: Expression
  ) {
    super([left, right]);
    this.operator = assertToken(
      token,
      'LESS',
      'LESSEQ',
      'GREATER',
      'GREATEREQ'
    );
    this.token = token;
  }

  public typeCheck(context: TypeCheckContext) {
    const type = cascadeError(
      assertType(context, this.left, 'relationalInt', 'int'),
      assertType(context, this.right, 'relationalInt', 'int')
    );
    return type instanceof ErrorType ? new ErrorType() : new BoolType();
  }

  public pretty(printContext: PrintContext) {
    return wrap(printContext, [
      wrapChild(printContext, this.left),
      ' ',
      this.operator,
      ' ',
      wrapChild(printContext, this.right),
    ]);
  }

  public getToken() {
    return this.token;
  }
}

export class NotNode extends Expression {
  public constructor(
    private readonly token: TokenNode,
    public readonly expression: Expression
  ) {
    super([expression]);
  }

  public typeCheck(context: TypeCheckContext) {
    return assertType(context, this.expression, 'nonBoolLogic', 'bool');
  }

  public pretty(printContext: PrintContext) {
    return [token('NOT'), this.expression.print(printContext)];
  }

  public getToken() {
    return this.token;
  }
}

export class MinusNode extends Expression {
  public constructor(
    private readonly token: TokenNode,
    public readonly expression: Expression
  ) {
    super([expression]);
  }

  public typeCheck(context: TypeCheckContext) {
    return assertType(context, this.expression, 'nonIntArith', 'int');
  }

  public pretty(printContext: PrintContext) {
    return [token('MINUS'), this.expression.print(printContext)];
  }

  public getToken() {
    return this.token;
  }
}

export class AssignmentStatement extends Statement {
  public constructor(public readonly expression: AssignmentExpression) {
    super([expression]);
  }

  public pretty(printContext: PrintContext) {
    return this.expression.print(printContext);
  }

  public getToken() {
    return this.expression.getToken();
  }

  public typeCheck(context: TypeCheckContext) {
    return this.expression.typeCheck(context);
  }
}

export class AssignmentExpression extends Expression {
  public constructor(
    public readonly id: IdNode,
    public readonly token: TokenNode,
    public readonly expression: Expression
  ) {
    super([id, expression]);
  }

  public typeCheck(context: TypeCheckContext) {
    const leftType = assertType(
      context,
      this.id,
      'invalidOperand',
      'int',
      'bool'
    );
    const rightType = assertType(
      context,
      this.expression,
      'invalidOperand',
      'int',
      'bool'
    );
    const cascadeType = cascadeError(leftType, rightType);
    return !(cascadeType instanceof ErrorType) &&
      leftType.toString() !== rightType.toString()
      ? context.reportError(this, 'invalidAssign')
      : cascadeType;
  }

  public pretty(printContext: PrintContext) {
    return [
      this.id.print(printContext),
      ' ',
      token('ASSIGN'),
      ' ',
      this.expression.print(printContext),
    ];
  }

  public getToken() {
    return new SynteticToken(this.id).getToken();
  }
}

export class FunctionCallStatement extends Statement {
  public constructor(public readonly expression: FunctionCall) {
    super([expression]);
  }

  public pretty(printContext: PrintContext) {
    return [this.expression.print(printContext)];
  }

  public getToken() {
    return this.expression.getToken();
  }

  public typeCheck(context: TypeCheckContext) {
    return this.expression.typeCheck(context);
  }
}

export class FunctionCall extends Expression {
  public constructor(
    public readonly id: IdNode,
    public readonly actualsList: ActualsList,
    token: TokenNode
  ) {
    super([id, actualsList, token]);
  }

  public typeCheck(context: TypeCheckContext) {
    const functionType = assertType(
      context,
      this.id,
      'nonFuncCall',
      'function'
    ) as ErrorType | FunctionType;
    if (functionType instanceof ErrorType) return functionType;

    const actuals = this.actualsList.children;
    const formals = functionType.type.typeList.children;
    if (actuals.length === formals.length)
      this.actualsList.children.forEach((child, index) => {
        const type = child.typeCheck(context);
        if (type.toString() !== formals[index].typeCheck(context).toString())
          context.reportError(child, 'argType');
      });
    else context.reportError(this, 'argLength');

    return functionType.type.returnType.typeCheck(context);
  }

  public getToken() {
    return this.id.getToken();
  }

  public pretty(printContext: PrintContext) {
    return [
      this.id.print({ ...printContext, mode: 'pretty' }),
      printContext.mode === 'nameAnalysis' ? this.printType(printContext) : '',
      token('LPAREN'),
      this.actualsList.print(printContext),
      token('RPAREN'),
    ];
  }

  public printType(printContext: PrintContext) {
    const declaration = findDeclaration(
      this.id.getName(),
      this.nameAnalysisContext
    )!;
    return declaration.printType(printContext);
  }
}

export class ActualsList extends AstNode {
  public constructor(public readonly expressions: RA<Expression>) {
    super(expressions);
  }

  public pretty(printContext: PrintContext) {
    return this.expressions
      .map((expression) => expression.print(printContext))
      .join(`${token('COMMA')} `);
  }
}

export class IntLiteralNode extends Term {
  public constructor(public readonly token: TokenNode) {
    super([token]);
  }

  public typeCheck() {
    return new IntType();
  }

  public pretty(): string {
    return (this.token.token.data as Tokens['INTLITERAL']).literal.toString();
  }

  public getToken() {
    return this.token;
  }
}

export class StringLiteralNode extends Term {
  public constructor(public readonly token: TokenNode) {
    super([token]);
  }

  public typeCheck() {
    return new StringType();
  }

  public pretty(): string {
    return (
      this.token.token.data as Tokens['STRINGLITERAL']
    ).literal.toString();
  }

  public getToken() {
    return this.token;
  }
}

export class BooleanLiteralNode extends Term {
  public constructor(public readonly token: TokenNode) {
    super([token]);
  }

  public typeCheck() {
    return new BoolType();
  }

  public getToken() {
    return this.token;
  }
}

export class MayhemNode extends Term {
  public constructor(public readonly token: TokenNode) {
    super([token]);
  }

  public typeCheck() {
    return new IntType();
  }

  public getToken() {
    return this.token;
  }
}

/* eslint-enable functional/no-class */
/* eslint-enable functional/no-this-expression */
/* eslint-enable functional/prefer-readonly-type */
/* eslint-enable @typescript-eslint/explicit-module-boundary-types */
/* eslint-enable functional/no-throw-statement */
/* eslint-enable @typescript-eslint/member-ordering */
/* eslint-enable @typescript-eslint/explicit-function-return-type */
/* eslint-enable class-methods-use-this */
