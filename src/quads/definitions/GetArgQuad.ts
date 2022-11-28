import type { RA } from '../../utils/types.js';
import { AssignQuad } from './AssignQuad.js';
import type { FormalQuad } from './FormalQuad.js';
import { mem, TempVariable } from './IdQuad.js';
import { Quad } from './index.js';
import { LoadQuad } from './LoadQuad.js';
import type { Register } from './Register.js';
import { NextComment } from '../../instructions/definitions/NextComment.js';

export class GetArgQuad extends Quad {
  private readonly mipsLoadQuad: LoadQuad;
  private readonly amdLoadQuad: LoadQuad;

  private readonly assignQuad: AssignQuad;

  public constructor(
    private readonly index: number,
    private readonly formal: FormalQuad,
    tempRegister: Register,
    length: number
  ) {
    super();
    const resolvedIndex = -(length - this.index) + 1;
    const tempVariable = new TempVariable(resolvedIndex);
    this.mipsLoadQuad = new LoadQuad(tempRegister, tempVariable);
    const amdTempVariable = new TempVariable(resolvedIndex - 2);
    this.amdLoadQuad = new LoadQuad(tempRegister, amdTempVariable);
    this.assignQuad = new AssignQuad(undefined, this.formal.tempVariable, [
      tempRegister,
    ]);
  }

  public toString(): RA<string> {
    return [`getarg ${this.index + 1} ${mem(this.formal.id)}`];
  }

  public toMips() {
    return [
      new NextComment(`Getting argument "${this.formal.id}"`),
      ...this.mipsLoadQuad.toMips(),
      ...this.assignQuad.toMips(),
    ];
  }

  public toAmd() {
    return [
      new NextComment(`Getting argument "${this.formal.id}"`),
      ...this.amdLoadQuad.toAmd(),
      ...this.assignQuad.toAmd(),
    ];
  }
}
