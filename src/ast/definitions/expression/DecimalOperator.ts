import type { EvalContext } from '../../eval.js';
import { OperationQuad } from '../../quads/definitions.js';
import type { QuadsContext } from '../../quads/index.js';
import type { TypeCheckContext } from '../../typing.js';
import { assertType, cascadeError } from '../../typing.js';
import type { PrintContext } from '../../unparse.js';
import { wrap, wrapChild } from '../../unparse.js';
import type { TokenNode } from '../TokenNode.js';
import { assertToken } from '../TokenNode.js';
import { Expression } from './index.js';

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

  public async evaluate(context: EvalContext) {
    const left = await this.left.evaluate(context);
    const right = await this.right.evaluate(context);
    if (typeof left !== 'number' || typeof right !== 'number')
      throw new Error('Cannot perform arithmetic on non-numbers');
    else if (this.operator === '+') return left + right;
    else if (this.operator === '-') return left - right;
    else if (this.operator === '*') return left * right;
    else if (this.operator === '/') {
      if (right === 0) throw new Error('Cannot divide by zero');
      return left / right;
    }
    return undefined;
  }

  public toQuads(context: QuadsContext) {
    return [
      new OperationQuad(
        this.left.toQuads(context),
        this.operator,
        this.right.toQuads(context)
      ),
    ];
  }
}
