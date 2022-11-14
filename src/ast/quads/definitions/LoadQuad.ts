import { Quad } from './index.js';

export class LoadQuad extends Quad {
  public constructor(
    private readonly tempRegister: string,
    private readonly tempVariable: string,
    private readonly isFunction = false
  ) {
    super();
  }

  public toString() {
    return [];
  }

  public toMips() {
    return [
      `${this.isFunction ? 'la' : 'lw'} ${this.tempRegister}, ${
        this.tempVariable
      }`,
    ];
  }

  public toMipsValue() {
    return this.tempRegister;
  }
}
