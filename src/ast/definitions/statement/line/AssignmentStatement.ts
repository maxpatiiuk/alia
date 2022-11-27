import type { EvalContext } from '../../../eval.js';
import type { QuadsContext } from '../../../../quads/index.js';
import type { TypeCheckContext } from '../../../typing.js';
import type { PrintContext } from '../../../unparse.js';
import type { AssignmentExpression } from '../../expression/AssignmentExpression.js';
import { LineStatement } from './index.js';

export class AssignmentStatement extends LineStatement {
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

  public async evaluate(context: EvalContext) {
    return this.expression.evaluate(context);
  }

  public toQuads(context: QuadsContext) {
    return this.expression.toQuads(context);
  }
}
