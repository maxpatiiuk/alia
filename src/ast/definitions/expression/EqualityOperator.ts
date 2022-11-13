import type { EvalContext } from '../../eval.js';
import type { QuadsContext } from '../../quads/index.js';
import type { LanguageType, TypeCheckContext } from '../../typing.js';
import { assertType, BoolType, cascadeError, ErrorType } from '../../typing.js';
import type { PrintContext } from '../../unparse.js';
import { wrap, wrapChild } from '../../unparse.js';
import { SynteticToken } from '../SynteticToken.js';
import type { TokenNode } from '../TokenNode.js';
import { assertToken } from '../TokenNode.js';
import { Expression } from './index.js';
import { OperationQuad } from '../../quads/definitions/OperationQuad.js';

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

  public async evaluate(context: EvalContext) {
    const left = await this.left.evaluate(context);
    const right = await this.right.evaluate(context);
    const equal = left === right;
    return (this.operator === '==') === equal;
  }

  public toQuads(context: QuadsContext) {
    return [
      new OperationQuad(
        this.left.toQuads(context),
        this.operator,
        this.right.toQuads(context),
        context
      ),
    ];
  }
}
