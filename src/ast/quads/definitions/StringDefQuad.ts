import { MipsQuad } from './GenericQuad.js';
import { LabelQuad, Quad } from './index.js';

export class StringDefQuad extends Quad {
  private readonly quad: Quad;

  public constructor(
    private readonly name: string,
    private readonly value: string
  ) {
    super();

    this.quad = new LabelQuad(this.name, new MipsQuad('.asciiz', this.value));
  }

  public toString() {
    return [`${this.name} ${this.value}`];
  }

  public toMips() {
    return this.quad.toMips();
  }
}

export const formatStringQuad = (index: number): string => `str_${index}`;
