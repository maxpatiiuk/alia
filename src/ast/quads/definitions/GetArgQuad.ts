import type { RA } from '../../../utils/types.js';
import { mem, Quad } from './index.js';

export class GetArgQuad extends Quad {
  public constructor(
    private readonly index: number,
    private readonly id: string
  ) {
    super();
  }

  public toString(): RA<string> {
    return [`getarg ${this.index} ${mem(this.id)}`];
  }
}
