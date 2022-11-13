import { mem, Quad } from './index.js';

export class GetRetQuad extends Quad {
  public constructor(private readonly tempName: string) {
    super();
  }

  public toString() {
    return [`getret ${mem(this.tempName)}`];
  }

  public toValue() {
    return mem(this.tempName);
  }
}
