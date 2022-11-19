import { AssignQuad } from './AssignQuad.js';
import { Register } from './GetArgQuad.js';
import { addComment, Quad } from './index.js';

export class VarDeclQuad extends Quad {
  public readonly assignQuad: AssignQuad;

  public constructor(
    private readonly id: string,
    private readonly tempVariable: number | string
  ) {
    super();
    this.assignQuad = new AssignQuad(undefined, this.tempVariable, [
      new Register('$zero', '$0'),
    ]);
  }

  public toString() {
    return [];
  }

  public toMips() {
    return addComment(this.assignQuad.toMips(), `Initializing ${this.id}`);
  }

  public toAmd() {
    return addComment(this.assignQuad.toAmd(), `Initializing ${this.id}`);
  }
}
