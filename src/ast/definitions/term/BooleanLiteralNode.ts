import type { EvalContext } from '../../eval.js';
import { BoolType } from '../../typing.js';
import type { TokenNode } from '../TokenNode.js';
import { Term } from './index.js';
import { QuadsContext } from '../../quads/index.js';
import { BoolLiteralQuad } from '../../quads/definitions/IntLiteralQuad.js';

export class BooleanLiteralNode extends Term {
  public constructor(public readonly token: TokenNode) {
    super([token]);
  }

  public typeCheck() {
    return new BoolType();
  }

  public getToken() {
    return this.token;
  }

  public async evaluate(_context: EvalContext) {
    return this.token.token.type === 'TRUE';
  }

  public toQuads(context: QuadsContext) {
    return [
      new BoolLiteralQuad(
        this.token.token.type === 'TRUE' ? '1' : '0',
        context.requestTempRegister(),
        context.requestTemp()
      ),
    ];
  }
}
