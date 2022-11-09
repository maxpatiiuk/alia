import type { EvalContext } from '../../../eval.js';
import type { TypeCheckContext } from '../../../typing.js';
import { assertType } from '../../../typing.js';
import type { PrintContext } from '../../../unparse.js';
import type { IdNode } from '../../term/IdNode.js';
import { VariableDeclaration } from '../VariableDeclaration.js';
import { LineStatement } from './index.js';

export class PostNode extends LineStatement {
  public constructor(
    public readonly id: IdNode,
    public readonly type: '--' | '++'
  ) {
    super([id]);
  }

  public typeCheck(context: TypeCheckContext) {
    return assertType(context, this.id, 'nonIntArith', 'int');
  }

  public getToken() {
    return this.id.getToken();
  }

  public pretty(printContext: PrintContext) {
    return [this.id.print(printContext), this.type];
  }

  public async evaluate(_context: EvalContext) {
    const declaration = this.id.getDeclaration();
    if (!(declaration instanceof VariableDeclaration))
      throw new Error('Cannot increment non-variable');
    const value = declaration.value;
    if (typeof value !== 'number')
      throw new Error('Cannot increment non-numeric variable');
    declaration.value = value + (this.type === '++' ? 1 : -1);
    return value;
  }
}
