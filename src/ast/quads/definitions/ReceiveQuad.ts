import type { RA } from '../../../utils/types.js';
import { mem, Quad } from './index.js';

export class ReceiveQuad extends Quad {
  public constructor(private readonly id: string) {
    super();
  }

  public toString(): RA<string> {
    return [`RECEIVE ${mem(this.id)}`];
  }
}
