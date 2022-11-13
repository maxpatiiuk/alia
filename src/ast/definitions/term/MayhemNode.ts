import type { EvalContext } from '../../eval.js';
import { IntType } from '../../typing.js';
import type { TokenNode } from '../TokenNode.js';
import { Term } from './index.js';
import { QuadsContext } from '../../quads/index.js';
import { MayhemQuad } from '../../quads/definitions/MayhemQuad.js';

export class MayhemNode extends Term {
  public constructor(public readonly token: TokenNode) {
    super([token]);
  }

  public typeCheck() {
    return new IntType();
  }

  public getToken() {
    return this.token;
  }

  public async evaluate(_context: EvalContext) {
    return Math.random() * 1024;
  }

  public toQuads(context: QuadsContext) {
    return [new MayhemQuad(context.requestTemp())];
  }
}
