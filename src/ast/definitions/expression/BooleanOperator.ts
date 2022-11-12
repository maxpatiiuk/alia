import type { EvalContext } from '../../eval.js';
import type { TypeCheckContext } from '../../typing.js';
import { assertType, cascadeError } from '../../typing.js';
import type { PrintContext } from '../../unparse.js';
import { wrap, wrapChild } from '../../unparse.js';
import type { TokenNode } from '../TokenNode.js';
import { assertToken } from '../TokenNode.js';
import { Expression } from './index.js';
import { QuadsContext } from '../../quads/index.js';
import { OperationQuad } from '../../quads/definitions.js';

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

  public async evaluate(context: EvalContext) {
    const left = await this.left.evaluate(context);
    const right = await this.right.evaluate(context);
    if (typeof left !== 'boolean' || typeof right !== 'boolean')
      throw new Error('Cannot perform logic on non-booleans');
    else if (this.operator === 'and') return left && right;
    else return left || right;
  }

  public toQuads(context: QuadsContext) {
    return [
      new OperationQuad(
        this.left.toQuads(context),
        this.operator,
        this.right.toQuads(context),
        context.requestTemp()
      ),
    ];
  }
}
