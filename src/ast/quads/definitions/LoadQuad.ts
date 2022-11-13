import { Quad } from './index.js';

export class LoadQuad extends Quad {
  public constructor(
    private readonly tempRegister: string,
    private readonly tempVariable: string
  ) {
    super();
  }

  public toMips() {
    return [`lw ${this.tempRegister}, ${this.tempVariable}`];
  }

  public toMipsValue() {
    return this.tempVariable;
  }
}
