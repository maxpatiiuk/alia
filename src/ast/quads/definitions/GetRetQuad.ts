import { mem, Quad } from './index.js';
import { reg } from './IdQuad.js';
import { AssignQuad } from './AssignQuad.js';
import { Register } from './GetArgQuad.js';

export class GetRetQuad extends Quad {
  private readonly assignQuad: AssignQuad;

  public constructor(private readonly tempVariable: string | number) {
    super();
    this.assignQuad = new AssignQuad(undefined, this.tempVariable, [
      new Register('$v0'),
    ]);
  }

  public toString() {
    return [`getret ${mem(this.tempVariable)}`];
  }

  public toValue() {
    return mem(this.tempVariable);
  }

  public toMips() {
    return this.assignQuad.toMips();
  }

  public toMipsValue() {
    return reg(this.tempVariable);
  }
}
