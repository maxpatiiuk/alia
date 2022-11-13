import { AssignQuad } from './AssignQuad.js';
import { Register } from './GetArgQuad.js';
import { addComment, Quad } from './index.js';
import { LoadQuad } from './LoadQuad.js';

export class SetArgQuad extends Quad {
  private readonly loadQuad: LoadQuad;

  private readonly assignQuad: AssignQuad;

  public constructor(
    private readonly index: number,
    private readonly value: string,
    mipsVariable: string,
    tempRegister: string,
    tempVariable: number
  ) {
    super();
    this.loadQuad = new LoadQuad(tempRegister, mipsVariable);
    this.assignQuad = new AssignQuad(undefined, tempVariable, [
      new Register(tempRegister),
    ]);
  }

  public toString() {
    return [`setarg ${this.index} ${this.value}`];
  }

  public toMips() {
    return addComment(
      [...this.loadQuad.toMips(), ...this.assignQuad.toMips()],
      `Setting argument ${this.index}`
    );
  }
}
