import type { TempVariable } from './IdQuad.js';
import { Quad } from './index.js';
import { Register } from './Register.js';
import { MovQ } from '../../instructions/definitions/amd/MovQ.js';
import { La } from '../../instructions/definitions/mips/La.js';
import { Lw } from '../../instructions/definitions/mips/Lw.js';

export class LoadQuad extends Quad {
  public constructor(
    private readonly tempRegister: Register,
    private readonly tempVariable: Register | TempVariable,
    private readonly isFunction = false
  ) {
    super();
  }

  public toString() {
    return [];
  }

  public toMips() {
    return [
      ...this.tempRegister.toMips(),
      new (this.isFunction ? La : Lw)(
        this.tempRegister.toMipsValue(),
        this.tempVariable.toMipsValue()
      ),
    ];
  }

  public toMipsValue() {
    return this.tempRegister.toMipsValue();
  }

  public toAmd() {
    return [
      ...this.tempRegister.toAmd(),
      new MovQ(
        `${this.isFunction ? '$' : ''}${this.tempVariable.toAmdValue()}`,
        this.tempRegister.toAmdValue()
      ),
    ];
  }

  public toAmdValue() {
    return this.tempRegister.toAmdValue();
  }
}
