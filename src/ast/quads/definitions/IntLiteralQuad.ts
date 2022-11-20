import type { TempVariable } from './IdQuad.js';
import { Quad } from './index.js';
import { TermQuad } from './TermQuad.js';
import { Register } from './Register.js';

export class IntLiteralQuad extends Quad {
  private readonly termQuad: TermQuad;

  public constructor(
    private readonly value: string,
    private readonly tempRegister: Register,
    private readonly tempVariable: TempVariable
  ) {
    super();
    this.termQuad = new TermQuad(this.value);
  }

  public toString() {
    return this.termQuad.toString();
  }

  public toValue() {
    return this.termQuad.toValue();
  }

  public toMips() {
    return [
      `li ${this.tempRegister.toMipsValue()}, ${this.value} # Int Literal: ${
        this.value
      }`,
      `sw ${this.tempRegister.toMipsValue()}, ${this.tempVariable.toMipsValue()}`,
    ];
  }

  public toMipsValue() {
    return this.tempVariable.toMipsValue();
  }

  public toAmd() {
    return [
      `movq $${this.value} ${this.tempVariable.toAmdValue()}, # Int Literal: ${
        this.value
      }`,
    ];
  }

  public toAmdValue() {
    return this.tempVariable.toAmdValue();
  }
}
