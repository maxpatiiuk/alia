import { mem, Quad } from './index.js';

export class MayhemQuad extends Quad {
  public constructor(private readonly tempName: string) {
    super();
  }

  public toString() {
    return [`MAYHEM ${mem(this.tempName)}`];
  }

  public toValue() {
    return mem(this.tempName);
  }
}
