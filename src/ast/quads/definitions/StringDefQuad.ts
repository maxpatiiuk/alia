import { LabelQuad, Quad } from './index.js';

export class StringDefQuad extends Quad {
  private readonly label: LabelQuad;

  public constructor(
    private readonly name: string,
    private readonly value: string
  ) {
    super();

    this.label = new LabelQuad(this.name);
  }

  public toString() {
    return [`${this.name} ${this.value}`];
  }

  public toMips() {
    return [this.label, `.asciiz ${this.value}`];
  }

  public toAmd() {
    return [this.label, `.asciiz ${this.value}`];
  }
}

export const formatStringQuad = (index: number): string => `str_${index}`;
