import { simpleTokens } from '../tokenize/definitions.js';
import type { Tokens } from '../tokenize/tokens.js';
import type { Token } from '../tokenize/types.js';
import { indentation } from '../unparseParseTree/index.js';
import type { RA, WritableArray } from '../utils/types.js';

/* eslint-disable functional/no-class */
/* eslint-disable functional/no-this-expression */
/* eslint-disable functional/prefer-readonly-type */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable functional/no-throw-statement */

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export abstract class AstNode {
  public context: Context;

  private readonly items: WritableArray<FunctionDecl | VariableDeclaration>;

  public constructor(public readonly children: RA<AstNode>) {
    this.items = [];
    this.context = {
      symbolTable: [],
      isDeclaration: false,
      reportError: (_idNode, _token, error) => {
        throw new Error(error);
      },
    };
  }

  public nameAnalysis(context: Context): void {
    this.context = context;

    this.children.forEach((child) => child.nameAnalysis(context));
  }

  public createScope(): Scope {
    return {
      items: this.items,
      addItem: (item, dry) => {
        const itemName = item.id.getName();
        const duplicateIdentifier = this.items.find(
          (declaration) => declaration.id.getName() === itemName
        );
        if (typeof duplicateIdentifier === 'object')
          this.context.reportError(
            item.id,
            item.id.token,
            'Multiply declared identifier'
          );
        else if (dry !== true) this.items.push(item);
      },
    };
  }

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

  public printType(_printContext: PrintContext): string {
    throw new Error('PrintType is not implemented');
  }
}

export type Context = {
  readonly symbolTable: RA<Scope>;
  // If IdNode is used inside a declaration, supress undefined identifier errors
  readonly isDeclaration: boolean;
  readonly reportError: (
    idNode: IdNode,
    token: TokenNode,
    message: string
  ) => void;
};

type Scope = {
  readonly items: RA<FunctionDecl | VariableDeclaration>;
  readonly addItem: (
    item: FunctionDecl | VariableDeclaration,
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
}

export class GlobalsNode extends AstNode {
  public constructor(
    public readonly children: RA<FunctionDecl | VariableDeclaration>
  ) {
    super([]);
  }

  public pretty(printContext: PrintContext) {
    return this.children.flatMap((child, index, { length }) => [
      child.print(printContext),
      child instanceof FunctionDecl ? '' : `${token('SEMICOL')}`,
      index + 1 === length ? '' : '\n',
    ]);
  }
}

export class Statement extends AstNode {}

function getScope(node: AstNode) {
  const currentScope = node.context.symbolTable.at(-1);
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

  public nameAnalysis(context: Context) {
    super.nameAnalysis({ ...context, isDeclaration: true });
    if (
      this.type instanceof PrimaryTypeNode &&
      this.type.token.token.type === 'VOID'
    ) {
      this.context.reportError(
        this.id,
        this.id.token,
        'Invalid type in declaration'
      );
      getScope(this).addItem(this, true);
    } else getScope(this).addItem(this);
  }

  public pretty(printContext: PrintContext) {
    return [this.type.print(printContext), ' ', this.id.print(printContext)];
  }

  public printType(printContext: PrintContext) {
    return this.id.printType(printContext);
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
}

export class Expression extends AstNode {}

export class Term extends Expression {}

const findDeclaration = (
  name: string,
  context: Context
): FunctionDecl | VariableDeclaration | undefined =>
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

  public nameAnalysis(context: Context) {
    super.nameAnalysis(context);
    if (context.isDeclaration) return;
    if (this.getDeclaration() === undefined)
      this.context.reportError(this, this.token, 'Undeclared identifier');
  }

  private getDeclaration(): FunctionDecl | VariableDeclaration | undefined {
    return findDeclaration(this.getName(), this.context);
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
  public constructor(
    private readonly typeList: TypeListNode,
    private readonly returnType: TypeNode
  ) {
    super([typeList, returnType]);
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
      .join(',');
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

export class FunctionDecl extends AstNode {
  public constructor(
    public readonly type: TypeNode,
    public readonly id: IdNode,
    public readonly formals: FormalsDeclNode,
    private readonly statements: StatementList
  ) {
    super([type, id, formals, statements]);
  }

  public nameAnalysis(context: Context) {
    this.context = context;
    getScope(this).addItem(this);
    this.type.nameAnalysis(context);
    this.id.nameAnalysis({ ...context, isDeclaration: true });
    const newScope = {
      ...context,
      symbolTable: [...context.symbolTable, this.createScope()],
    };
    this.formals.nameAnalysis(newScope);
    this.statements.nameAnalysis(newScope);
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
}

export class BlockStatement extends Statement {}

export class WhileNode extends BlockStatement {
  public constructor(
    public readonly condition: Expression,
    public readonly statements: StatementList
  ) {
    super([condition, statements]);
  }

  public nameAnalysis(context: Context) {
    this.context = context;
    this.condition.nameAnalysis(context);
    const newScope = {
      ...context,
      symbolTable: [...context.symbolTable, this.createScope()],
    };
    this.statements.nameAnalysis(newScope);
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
}

export class ForNode extends BlockStatement {
  public constructor(
    public readonly declaration: Statement,
    public readonly condition: Expression,
    public readonly action: Statement,
    public readonly statements: StatementList
  ) {
    super([declaration, condition, action, statements]);
  }

  public nameAnalysis(context: Context) {
    this.context = context;
    const newScope = {
      ...context,
      symbolTable: [...context.symbolTable, this.createScope()],
    };
    this.declaration.nameAnalysis(newScope);
    this.condition.nameAnalysis(newScope);
    const fullStatements = new StatementList([
      ...this.statements.children,
      this.action,
    ]);
    fullStatements.nameAnalysis(newScope);
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
}

export class IfNode extends BlockStatement {
  public constructor(
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

  public nameAnalysis(context: Context) {
    this.context = context;
    this.condition.nameAnalysis(context);
    const newScope = {
      ...context,
      symbolTable: [...context.symbolTable, this.createScope()],
    };
    this.statements.nameAnalysis(newScope);
    if (typeof this.elseStatements === 'object') {
      const newScope = {
        ...context,
        symbolTable: [...context.symbolTable, this.createScope()],
      };
      this.elseStatements.nameAnalysis(newScope);
    }
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
}

export class LineStatement extends Statement {}

export class PostNode extends LineStatement {
  public constructor(
    public readonly id: IdNode,
    public readonly type: '--' | '++'
  ) {
    super([id]);
  }

  public pretty(printContext: PrintContext) {
    return [this.id.print(printContext), this.type];
  }
}

export class InputNode extends LineStatement {
  public constructor(public readonly id: IdNode) {
    super([id]);
  }

  public pretty(printContext: PrintContext) {
    return [token('INPUT'), ' ', this.id.print(printContext)];
  }
}

export class OutputNode extends LineStatement {
  public constructor(public readonly expression: Expression) {
    super([expression]);
  }

  public pretty(printContext: PrintContext) {
    return [token('OUTPUT'), ' ', this.expression.print(printContext)];
  }
}

export class ReturnNode extends LineStatement {
  public constructor(public readonly expression: Expression | undefined) {
    super(expression === undefined ? [] : [expression]);
  }

  public pretty(printContext: PrintContext) {
    return [
      token('RETURN'),
      ...(this.expression ? [' ', this.expression.print(printContext)] : []),
    ];
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

export class DecimalOperator extends Expression {
  public constructor(
    public readonly left: Expression,
    public readonly operator: '-' | '*' | '/' | '+',
    public readonly right: Expression
  ) {
    super([left, right]);
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
}

export class BooleanOperator extends Expression {
  public constructor(
    public readonly left: Expression,
    public readonly operator: 'and' | 'or',
    public readonly right: Expression
  ) {
    super([left, right]);
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
}

export class ComparisonOperator extends Expression {
  public constructor(
    public readonly left: Expression,
    public readonly operator: '!=' | '<' | '<=' | '==' | '>' | '>=',
    public readonly right: Expression
  ) {
    super([left, right]);
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
}

export class NotNode extends Expression {
  public constructor(public readonly expression: Expression) {
    super([expression]);
  }

  public pretty(printContext: PrintContext) {
    return [token('NOT'), this.expression.print(printContext)];
  }
}

export class MinusNode extends Expression {
  public constructor(public readonly expression: Expression) {
    super([expression]);
  }

  public pretty(printContext: PrintContext) {
    return [token('MINUS'), this.expression.print(printContext)];
  }
}

export class AssignmentStatement extends Statement {
  public constructor(public readonly expression: AssignmentExpression) {
    super([expression]);
  }

  public pretty(printContext: PrintContext) {
    return this.expression.print(printContext);
  }
}

export class AssignmentExpression extends Expression {
  public constructor(
    public readonly id: IdNode,
    public readonly expression: Expression
  ) {
    super([id, expression]);
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
}

export class FunctionCallStatement extends Statement {
  public constructor(public readonly expression: FunctionCall) {
    super([expression]);
  }

  public pretty(printContext: PrintContext) {
    return [this.expression.print(printContext)];
  }
}

export class FunctionCall extends Expression {
  public constructor(
    public readonly id: IdNode,
    public readonly actualsList: ActualsList
  ) {
    super([id, actualsList]);
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
    const declaration = findDeclaration(this.id.getName(), this.context)!;
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

  public pretty(): string {
    return (this.token.token.data as Tokens['INTLITERAL']).literal.toString();
  }
}

export class StringLiteralNode extends Term {
  public constructor(public readonly token: TokenNode) {
    super([token]);
  }

  public pretty(): string {
    return (
      this.token.token.data as Tokens['STRINGLITERAL']
    ).literal.toString();
  }
}

export class BooleanLiteralNode extends Term {
  public constructor(public readonly token: TokenNode) {
    super([token]);
  }
}

export class MayhemNode extends Term {
  public constructor(public readonly token: TokenNode) {
    super([token]);
  }
}

/* eslint-enable functional/no-class */
/* eslint-enable functional/no-this-expression */
/* eslint-enable functional/prefer-readonly-type */
/* eslint-enable @typescript-eslint/explicit-module-boundary-types */
/* eslint-enable functional/no-throw-statement */
/* eslint-enable @typescript-eslint/explicit-function-return-type */
