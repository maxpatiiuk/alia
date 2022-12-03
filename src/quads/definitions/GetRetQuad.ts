import { AssignQuad } from './AssignQuad.js';
import type { TempVariable } from './IdQuad.js';
import { Quad } from './index.js';
import { Register } from './Register.js';

export class GetRetQuad extends Quad {
  private readonly assignQuad: AssignQuad;

  public constructor(private readonly tempVariable: TempVariable) {
    super();
    this.assignQuad = new AssignQuad(undefined, this.tempVariable, [
      new Register('$v0', '%rax'),
    ]);
  }

  public toString() {
    return [`getret ${this.tempVariable.toValue()}`];
  }

  public toValue() {
    return this.tempVariable.toValue();
  }

  public toMips() {
    return this.assignQuad.toMips();
  }

  public toMipsValue() {
    return this.tempVariable.toMipsValue();
  }

  public toAmd() {
    return this.assignQuad.toAmd();
  }

  public toAmdValue() {
    return this.tempVariable.toAmdValue();
  }
}
