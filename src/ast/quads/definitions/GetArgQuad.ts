import type { RA } from '../../../utils/types.js';
import { AssignQuad } from './AssignQuad.js';
import type { FormalQuad } from './FormalQuad.js';
import { mem, TempVariable } from './IdQuad.js';
import { addComment, Quad } from './index.js';
import { LoadQuad } from './LoadQuad.js';
import type { Register } from './Register.js';

export class GetArgQuad extends Quad {
  private readonly loadQuad: LoadQuad;

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
    this.loadQuad = new LoadQuad(tempRegister, tempVariable);
    this.assignQuad = new AssignQuad(undefined, this.formal.tempVariable, [
      tempRegister,
    ]);
  }

  public toString(): RA<string> {
    return [`getarg ${this.index + 1} ${mem(this.formal.id)}`];
  }

  public toMips() {
    return [
      ...addComment(
        this.loadQuad.toMips(),
        `Getting argument "${this.formal.id}"`
      ),
      ...this.assignQuad.toMips(),
    ];
  }

  public toAmd() {
    return [
      ...addComment(
        this.loadQuad.toAmd(),
        `Getting argument "${this.formal.id}"`
      ),
      ...this.assignQuad.toAmd(),
    ];
  }
}
