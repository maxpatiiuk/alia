import { simpleTokens } from '../tokenize/definitions.js';
import type { Tokens } from '../tokenize/tokens.js';
import type { Position, Token } from '../tokenize/types.js';
import { indentation } from '../unparseParseTree/index.js';
import type { RA } from '../utils/types.js';

/* eslint-disable functional/no-class */

/* eslint-disable functional/no-this-expression */

/* eslint-disable functional/prefer-readonly-type */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export abstract class AstNode {
  private context: Context;

  public constructor(public readonly children: RA<AstNode>) {
    this.context = {
      symbolTable: [],
      positionResolver(): never {
        throw new Error('Position Resolver is not defined');
      },
      isDeclaration: false,
    };
  }

  public nameAnalysis(context: Context): void {
    this.context = context;

    this.children.forEach((child) => child.nameAnalysis(context));
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
}

export type Context = {
  readonly symbolTable: RA<Scope>;
  readonly positionResolver: (position: number) => Position;
  readonly isDeclaration: boolean;
};

type Scope = {
  readonly items: RA<FunctionDecl | VariableDeclaration>;
  readonly addItem: (item: FunctionDecl | VariableDeclaration) => void;
};

type PrintContext = {
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

export class VariableDeclaration extends Statement {
  public constructor(
    private readonly type: TypeNode,
    private readonly id: IdNode
  ) {
    super([type, id]);
  }

  public pretty(printContext: PrintContext): RA<string> | string {
    return `${this.type.print(printContext)} ${this.id.print(printContext)}`;
  }
}

export class TypeNode extends AstNode {}

export class PrimaryTypeNode extends TypeNode {
  public constructor(private readonly token: TokenNode) {
    super([token]);
  }
}

export class Expression extends AstNode {}

export class Term extends Expression {}

export class IdNode extends Term {
  public constructor(private readonly token: TokenNode) {
    super([token]);
  }

  public pretty() {
    return (this.token.token.data as Tokens['ID']).literal.toString();
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
    private readonly type: TypeNode,
    private readonly id: IdNode,
    private readonly formals: FormalsDeclNode,
    private readonly statements: StatementList
  ) {
    super([type, id, formals, statements]);
  }

  public pretty(printContext: PrintContext) {
    return [
      this.type.print(printContext),
      ' ',
      this.id.print(printContext),
      token('LPAREN'),
      this.formals.print(printContext),
      token('RPAREN'),
      indent(printContext, this.statements),
    ];
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
}

export class FormalDeclNode extends AstNode {
  public constructor(
    private readonly type: TypeNode,
    private readonly id: IdNode
  ) {
    super([type, id]);
  }

  public pretty(printContext: PrintContext) {
    return [this.type.print(printContext), ' ', this.id.print(printContext)];
  }
}

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
      this.id.print(printContext),
      token('LPAREN'),
      this.actualsList.print(printContext),
      token('RPAREN'),
    ];
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
/* eslint-enable @typescript-eslint/explicit-function-return-type */
