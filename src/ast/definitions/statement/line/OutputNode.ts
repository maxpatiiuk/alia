import type { EvalContext } from '../../../eval.js';
import type { TypeCheckContext } from '../../../typing.js';
import { FunctionType, VoidType } from '../../../typing.js';
import type { PrintContext } from '../../../unparse.js';
import type { Expression } from '../../expression/index.js';
import { FunctionDeclaration } from '../../FunctionDeclaration.js';
import type { TokenNode } from '../../TokenNode.js';
import { token } from '../../TokenNode.js';
import { LineStatement } from './index.js';
import { QuadsContext } from '../../../quads/index.js';
import { ReportQuad } from '../../../quads/definitions.js';

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

  public async evaluate(context: EvalContext) {
    const value = await this.expression.evaluate(context);
    context.output(
      value instanceof FunctionDeclaration
        ? value.printType({
            indent: 0,
            mode: 'nameAnalysis',
            debug: false,
            needWrapping: false,
          })
        : value?.toString() ?? 'undefined'
    );
    return undefined;
  }

  public toQuads(context: QuadsContext) {
    return [new ReportQuad(this.expression.toQuads(context))];
  }
}
