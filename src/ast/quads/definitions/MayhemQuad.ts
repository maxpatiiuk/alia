import { mem, Quad } from './index.js';

export class MayhemQuad extends Quad {
  public constructor(private readonly tempVariable: string | number) {
    super();
  }

  public toString() {
    return [`MAYHEM ${mem(this.tempVariable)}`];
  }

  public toValue() {
    return mem(this.tempVariable);
  }

  // FIXME: convert to MIPS
}
