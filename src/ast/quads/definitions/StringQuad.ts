import { TermQuad } from './TermQuad.js';

export class StringQuad extends TermQuad {
  public constructor(private readonly name: string, value: string) {
    super(value);
  }

  public toMips() {
    return [];
  }

  public toMipsValue() {
    return this.name;
  }
}
