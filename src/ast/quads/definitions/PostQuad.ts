import { AssignQuad } from './AssignQuad.js';
import { mem, Quad } from './index.js';
import { OpQuad } from './OperationQuad.js';

export class PostQuad extends Quad {
  private readonly quad: AssignQuad;

  public constructor(id: string, type: '--' | '++') {
    super();
    this.quad = new AssignQuad(id, [new OpQuad(mem(id), type, '1')]);
  }

  public toString() {
    return this.quad.toString();
  }
}
