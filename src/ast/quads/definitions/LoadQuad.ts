import type { Register } from './GetArgQuad.js';
import type { TempVariable } from './IdQuad.js';
import { Quad } from './index.js';

export class LoadQuad extends Quad {
  public constructor(
    private readonly tempRegister: Register,
    private readonly tempVariable: TempVariable,
    private readonly isFunction = false
  ) {
    super();
  }

  public toString() {
    return [];
  }

  public toMips() {
    return [
      `${
        this.isFunction ? 'la' : 'lw'
      } ${this.tempRegister.toMipsValue()}, ${this.tempVariable.toMipsValue()}`,
    ];
  }

  public toMipsValue() {
    return this.tempRegister.toMipsValue();
  }

  public toAmd() {
    return [
      `movq ${this.tempRegister.toAmdValue()}, ${this.tempVariable.toAmdValue()}`,
    ];
  }

  public toAmdValue() {
    return this.tempRegister.toAmdValue();
  }
}
