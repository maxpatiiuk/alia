import { Quad } from './index.js';

export class SetArgQuad extends Quad {
  public constructor(
    private readonly index: number,
    private readonly value: string
  ) {
    super();
  }

  public toString() {
    return [`setarg ${this.index} ${this.value}`];
  }
}
