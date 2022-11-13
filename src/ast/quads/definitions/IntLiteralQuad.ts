import { Quad } from './index.js';
import { TermQuad } from './TermQuad.js';
import { reg } from './IdQuad.js';

export class IntLiteralQuad extends Quad {
  private readonly termQuad: TermQuad;

  public constructor(
    private readonly value: string,
    private readonly tempRegister: string,
    private readonly tempVariable: number
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
      `li ${this.tempRegister}, ${this.value}`,
      `sw ${this.tempRegister}, ${reg(this.tempVariable)}`,
    ];
  }

  public toMipsValue() {
    return reg(this.tempVariable);
  }
}
