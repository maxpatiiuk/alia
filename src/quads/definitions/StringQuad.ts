import { TermQuad } from './TermQuad.js';

export class StringQuad extends TermQuad {
  public constructor(private readonly name: string) {
    super(name);
  }

  public toMips() {
    return [];
  }

  public toMipsValue() {
    return this.name;
  }

  public toAmd() {
    return [];
  }

  public toAmdValue() {
    return `$${this.name}`;
  }
}
