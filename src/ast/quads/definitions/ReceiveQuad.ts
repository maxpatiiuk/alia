import type { RA } from '../../../utils/types.js';
import { mem, Quad } from './index.js';

export class ReceiveQuad extends Quad {
  public constructor(private readonly id: string) {
    super();
  }

  public toString(): RA<string> {
    return [`RECEIVE ${mem(this.id)}`];
  }

  public toMips(): RA<string> {
    console.warn('Warning: "input" statement is not yet implemented in MIPS');
    return [`# ${this.toString().at(-1)!}  # Not yet implemented`];
  }
}
