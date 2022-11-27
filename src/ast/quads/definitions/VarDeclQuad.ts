import { AssignQuad } from './AssignQuad.js';
import type { TempVariable } from './IdQuad.js';
import { Quad } from './index.js';
import { Register } from './Register.js';
import { NextComment } from '../../../instructions/definitions/NextComment.js';

export class VarDeclQuad extends Quad {
  public readonly assignQuad: AssignQuad;

  public constructor(
    private readonly id: string,
    private readonly tempVariable: TempVariable
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
    return [
      new NextComment(`Initializing ${this.id}`),
      ...this.assignQuad.toMips(),
    ];
  }

  public toAmd() {
    return [
      new NextComment(`Initializing ${this.id}`),
      ...this.assignQuad.toAmd(),
    ];
  }
}
