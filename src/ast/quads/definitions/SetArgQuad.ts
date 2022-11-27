import { NextComment } from '../../../instructions/NextComment.js';
import { AssignQuad } from './AssignQuad.js';
import type { TempVariable } from './IdQuad.js';
import { Quad } from './index.js';
import { LoadQuad } from './LoadQuad.js';
import type { Register } from './Register.js';

export class SetArgQuad extends Quad {
  private readonly loadQuad: LoadQuad | undefined;

  private readonly assignQuad: AssignQuad | undefined;

  public constructor(
    private readonly index: number,
    private readonly value: string,
    variable: Register | undefined,
    tempRegister: Register,
    tempVariable: TempVariable
  ) {
    super();
    this.loadQuad =
      variable === undefined ? undefined : new LoadQuad(tempRegister, variable);
    this.assignQuad =
      variable === undefined
        ? undefined
        : new AssignQuad(undefined, tempVariable, [tempRegister]);
  }

  public toString() {
    return [`setarg ${this.index} ${this.value}`];
  }

  public toMips() {
    return [
      new NextComment(`Setting argument ${this.index}`),
      ...(this.loadQuad?.toMips() ?? []),
      ...(this.assignQuad?.toMips() ?? []),
    ];
  }

  public toAmd() {
    return [
      new NextComment(`Setting argument ${this.index}`),
      ...(this.loadQuad?.toAmd() ?? []),
      ...(this.assignQuad?.toAmd() ?? []),
    ];
  }
}
