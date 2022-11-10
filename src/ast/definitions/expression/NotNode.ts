import type { EvalContext } from '../../eval.js';
import { OperationQuad } from '../../quads/definitions.js';
import type { QuadsContext } from '../../quads/index.js';
import type { TypeCheckContext } from '../../typing.js';
import { assertType } from '../../typing.js';
import type { PrintContext } from '../../unparse.js';
import type { TokenNode } from '../TokenNode.js';
import { token } from '../TokenNode.js';
import { Expression } from './index.js';

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

  public async evaluate(context: EvalContext) {
    const expression = await this.expression.evaluate(context);
    if (typeof expression !== 'boolean')
      throw new Error('Cannot perform negation on non-boolean');
    return !expression;
  }

  public toQuads(context: QuadsContext) {
    return [
      new OperationQuad(undefined, '!', this.expression.toQuads(context)),
    ];
  }
}
