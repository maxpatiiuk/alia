import { LlvmContext, Quad } from './index.js';
import { Asciz } from '../../instructions/definitions/amd/Asciz.js';
import { Asciiz } from '../../instructions/definitions/mips/Asciiz.js';
import { Label } from '../../instructions/definitions/Label.js';

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

  public toLlvm({ builder, module }: LlvmContext) {
    return builder.CreateGlobalString(this.value, this.name, 0, module);
  }
}

export const formatStringQuad = (index: number): string => `str_${index}`;
