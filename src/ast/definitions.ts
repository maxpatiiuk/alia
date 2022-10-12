import { simpleTokens } from '../tokenize/definitions.js';
import type { Tokens } from '../tokenize/tokens.js';
import type { Token } from '../tokenize/types.js';
import type { RA } from '../utils/types.js';

/* eslint-disable functional/no-class */

/* eslint-disable functional/no-this-expression */
export abstract class AstNode {
  public constructor(public readonly children: RA<AstNode>) {}

  public pretty(): string {
    return this.children.map((part) => part.pretty()).join('');
  }
}

const indexedSimpleTokens = Object.fromEntries(simpleTokens);

export class TokenNode extends AstNode {
  public constructor(public readonly token: Token) {
    super([]);
  }

  public pretty(): string {
    if (this.token.type === 'END') return '';
    else if (
      this.token.type === 'ID' ||
      this.token.type === 'INTLITERAL' ||
      this.token.type === 'STRINGLITERAL'
    )
      return (this.token.data as Tokens['ID']).literal.toString();
    else return indexedSimpleTokens[this.token.type];
  }
}

export class GlobalsNode extends AstNode {
  public constructor(
    public readonly children: RA<FunctionDecl | VariableDeclaration>
  ) {
    super([]);
  }
}

export class Statement extends AstNode {}

export class VariableDeclaration extends Statement {
  public constructor(
    private readonly type: TypeNode,
    private readonly id: IdNode
  ) {
    super([]);
  }
}

export class TypeNode extends AstNode {}

export class PrimaryTypeNode extends TypeNode {
  public constructor(private readonly token: TokenNode) {
    super([]);
  }
}

export class Expression extends AstNode {}

export class Term extends Expression {}

export class IdNode extends Term {
  public constructor(private readonly token: TokenNode) {
    super([]);
  }
}

export class FnTypeNode extends TypeNode {
  public constructor(
    private readonly typeList: TypeListNode,
    private readonly returnType: TypeNode
  ) {
    super([]);
  }
}

export class TypeListNode extends TypeNode {
  public constructor(public readonly children: RA<TypeNode>) {
    super([]);
  }
}

export class FunctionDecl extends AstNode {
  public constructor(
    private readonly type: TypeNode,
    private readonly id: IdNode,
    private readonly formals: FormalsDeclNode,
    private readonly statements: StatementList
  ) {
    super([]);
  }
}

export class FormalsDeclNode extends AstNode {
  public constructor(public readonly children: RA<FormalDeclNode>) {
    super([]);
  }
}

export class FormalDeclNode extends AstNode {
  public constructor(
    private readonly type: TypeNode,
    private readonly id: IdNode
  ) {
    super([]);
  }
}

export class StatementList extends AstNode {
  public constructor(public readonly children: RA<Statement>) {
    super([]);
  }
}

export class BlockStatement extends Statement {}

export class WhileNode extends BlockStatement {
  public constructor(
    public readonly condition: Expression,
    public readonly statements: StatementList
  ) {
    super([]);
  }
}

export class ForNode extends BlockStatement {
  public constructor(
    public readonly declaration: Statement,
    public readonly condition: Expression,
    public readonly action: Statement,
    public readonly statements: StatementList
  ) {
    super([]);
  }
}

export class IfNode extends BlockStatement {
  public constructor(
    public readonly condition: Expression,
    public readonly statements: StatementList,
    public readonly elseStatements: StatementList | undefined
  ) {
    super([]);
  }
}

export class LineStatement extends Statement {}

export class PostNode extends LineStatement {
  public constructor(
    public readonly id: IdNode,
    public readonly type: '--' | '++'
  ) {
    super([]);
  }
}

export class InputNode extends LineStatement {
  public constructor(public readonly id: IdNode) {
    super([]);
  }
}

export class OutputNode extends LineStatement {
  public constructor(public readonly expression: Expression) {
    super([]);
  }
}

export class ReturnNode extends LineStatement {
  public constructor(public readonly expression: Expression | undefined) {
    super([]);
  }
}

export class DecimalOperator extends Expression {
  public constructor(
    public readonly left: Expression,
    public readonly operator: '-' | '*' | '/' | '+',
    public readonly right: Expression
  ) {
    super([]);
  }
}

export class BooleanOperator extends Expression {
  public constructor(
    public readonly left: Expression,
    public readonly operator: 'and' | 'or',
    public readonly right: Expression
  ) {
    super([]);
  }
}

export class ComparisonOperator extends Expression {
  public constructor(
    public readonly left: Expression,
    public readonly operator: '!=' | '<' | '<=' | '==' | '>' | '>=',
    public readonly right: Expression
  ) {
    super([]);
  }
}

export class NotNode extends Expression {
  public constructor(public readonly expression: Expression) {
    super([]);
  }
}

export class MinusNode extends Expression {
  public constructor(public readonly expression: Expression) {
    super([]);
  }
}

export class AssignmentStatement extends Statement {
  public constructor(public readonly expression: AssignmentExpression) {
    super([]);
  }
}

export class AssignmentExpression extends Expression {
  public constructor(
    public readonly id: IdNode,
    public readonly expression: Expression
  ) {
    super([]);
  }
}
export class FunctionCallStatement extends Statement {
  public constructor(public readonly expression: FunctionCall) {
    super([]);
  }
}

export class FunctionCall extends Expression {
  public constructor(
    public readonly id: IdNode,
    public readonly actualsList: ActualsList
  ) {
    super([]);
  }
}

export class ActualsList extends AstNode {
  public constructor(public readonly expressions: RA<Expression>) {
    super([]);
  }
}

export class IntLiteralNode extends Term {
  public constructor(public readonly token: TokenNode) {
    super([]);
  }
}

export class StringLiteralNode extends Term {
  public constructor(public readonly token: TokenNode) {
    super([]);
  }
}

export class BooleanLiteralNode extends Term {
  public constructor(public readonly token: TokenNode) {
    super([]);
  }
}

export class MayhemNode extends Term {
  public constructor(public readonly token: TokenNode) {
    super([]);
  }
}

/* eslint-enable functional/no-class */
/* eslint-enable functional/no-this-expression */
