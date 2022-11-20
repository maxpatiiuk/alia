import { AssignQuad } from './AssignQuad.js';
import type { TempVariable } from './IdQuad.js';
import { addComment, Quad } from './index.js';
import { LoadQuad } from './LoadQuad.js';
import { Register } from './Register.js';

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
    return addComment(
      [
        ...(this.loadQuad?.toMips() ?? []),
        ...(this.assignQuad?.toMips() ?? []),
      ],
      `Setting argument ${this.index}`
    );
  }

  public toAmd() {
    return addComment(
      [...(this.loadQuad?.toAmd() ?? []), ...(this.assignQuad?.toAmd() ?? [])],
      `Setting argument ${this.index}`
    );
  }
}
