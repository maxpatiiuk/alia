import type { TempVariable } from './IdQuad.js';
import { Quad } from './index.js';
import { TermQuad } from './TermQuad.js';
import { Register } from './Register.js';
import { MovQ } from '../../../instructions/amd/MovQ.js';
import { NextComment } from '../../../instructions/NextComment.js';
import { Li } from '../../../instructions/mips/Li.js';
import { Sw } from '../../../instructions/mips/Sw.js';

export class IntLiteralQuad extends Quad {
  private readonly termQuad: TermQuad;

  public constructor(
    private readonly value: number,
    private readonly tempRegister: Register,
    private readonly tempVariable: TempVariable
  ) {
    super();
    this.termQuad = new TermQuad(this.value.toString());
  }

  public toString() {
    return this.termQuad.toString();
  }

  public toValue() {
    return this.termQuad.toValue();
  }

  public toMips() {
    return [
      new NextComment(`Int Literal: ${this.value}`),
      new Li(this.tempRegister.toMipsValue(), this.value),
      new Sw(this.tempRegister.toMipsValue(), this.tempVariable.toMipsValue()),
    ];
  }

  public toMipsValue() {
    return this.tempVariable.toMipsValue();
  }

  public toAmd() {
    return [
      new NextComment(`Int Literal: ${this.value}`),
      new MovQ(`$${this.value}`, `${this.tempVariable.toAmdValue()}`),
    ];
  }

  public toAmdValue() {
    return this.tempVariable.toAmdValue();
  }
}

export class BoolLiteralQuad extends IntLiteralQuad {}
