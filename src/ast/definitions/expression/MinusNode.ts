import type { EvalContext } from '../../eval.js';
import type { TypeCheckContext } from '../../typing.js';
import { assertType } from '../../typing.js';
import type { PrintContext } from '../../unparse.js';
import type { TokenNode } from '../TokenNode.js';
import { token } from '../TokenNode.js';
import { Expression } from './index.js';

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

  public async evaluate(context: EvalContext) {
    const expression = await this.expression.evaluate(context);
    if (typeof expression !== 'number')
      throw new Error('Cannot negate a non-number');
    return -expression;
  }
}
