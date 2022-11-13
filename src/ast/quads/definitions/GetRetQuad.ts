import { mem, Quad } from './index.js';

export class GetRetQuad extends Quad {
  public constructor(private readonly tempVariable: string | number) {
    super();
  }

  public toString() {
    return [`getret ${mem(this.tempVariable)}`];
  }

  public toValue() {
    return mem(this.tempVariable);
  }
}
