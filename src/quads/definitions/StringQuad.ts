import { TermQuad } from './TermQuad.js';
import { NextComment } from '../../instructions/definitions/NextComment.js';

export class StringQuad extends TermQuad {
  public constructor(
    private readonly name: string,
    private readonly value: string
  ) {
    super(name);
  }

  public toMips() {
    return [new NextComment(`String Literal: ${this.value}`)];
  }

  public toMipsValue() {
    return this.name;
  }

  public toAmd() {
    return [new NextComment(`String Literal: ${this.value}`)];
  }

  public toAmdValue() {
    return `$${this.name}`;
  }
}
