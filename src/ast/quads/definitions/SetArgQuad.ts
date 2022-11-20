import { AssignQuad } from './AssignQuad.js';
import { Register } from './GetArgQuad.js';
import { TempVariable } from './IdQuad.js';
import { addComment, Quad } from './index.js';
import { LoadQuad } from './LoadQuad.js';

// FIXME: implement
export class SetArgQuad extends Quad {
  private readonly loadQuad: LoadQuad | undefined;

  private readonly assignQuad: AssignQuad;

  public constructor(
    private readonly index: number,
    private readonly value: string,
    mipsVariable: Register | TempVariable,
    tempRegister: Register,
    tempVariable: TempVariable
  ) {
    super();
    this.loadQuad =
      mipsVariable instanceof TempVariable
        ? new LoadQuad(tempRegister, mipsVariable)
        : undefined;
    this.assignQuad = new AssignQuad(undefined, tempVariable, [
      mipsVariable instanceof TempVariable ? tempRegister : mipsVariable,
    ]);
  }

  public toString() {
    return [`setarg ${this.index} ${this.value}`];
  }

  public toMips() {
    return addComment(
      [...(this.loadQuad?.toMips() ?? []), ...this.assignQuad.toMips()],
      `Setting argument ${this.index}`
    );
  }
}
