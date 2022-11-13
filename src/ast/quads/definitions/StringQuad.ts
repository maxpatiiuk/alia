import { MipsQuad } from './GenericQuad.js';
import { LabelQuad, Quad } from './index.js';

export class StringQuad extends Quad {
  private readonly name: string;

  private readonly quad: Quad;

  public constructor(index: number, private readonly value: string) {
    super();

    this.name = formatStringQuad(index);
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
