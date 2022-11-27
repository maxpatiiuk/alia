import { Quad } from './index.js';
import { Asciz } from '../../../instructions/amd/Asciz.js';
import { Asciiz } from '../../../instructions/mips/Asciiz.js';
import { Label } from '../../../instructions/Label.js';

export class StringDefQuad extends Quad {
  private readonly label: Label;

  public constructor(
    private readonly name: string,
    private readonly value: string
  ) {
    super();

    this.label = new Label(this.name);
  }

  public toString() {
    return [`${this.name} ${this.value}`];
  }

  public toMips() {
    return [this.label, new Asciiz(this.value)];
  }

  public toAmd() {
    return [this.label, new Asciz(this.value)];
  }
}

export const formatStringQuad = (index: number): string => `str_${index}`;
