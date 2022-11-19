import { AssignQuad } from './AssignQuad.js';
import { Register } from './GetArgQuad.js';
import { addComment, Quad } from './index.js';
import { LoadQuad } from './LoadQuad.js';

export class SetArgQuad extends Quad {
  private readonly loadQuad: LoadQuad | undefined;

  private readonly assignQuad: AssignQuad;

  public constructor(
    private readonly index: number,
    private readonly value: string,
    mipsVariable: string | Register,
    tempRegister: Register,
    tempVariable: number
  ) {
    super();
    this.loadQuad =
      typeof mipsVariable === 'string'
        ? new LoadQuad(tempRegister, mipsVariable)
        : undefined;
    this.assignQuad = new AssignQuad(undefined, tempVariable, [
      mipsVariable instanceof Register ? mipsVariable : tempRegister,
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
