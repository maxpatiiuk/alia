import type { RA } from '../../../utils/types.js';
import { addComment, mem, Quad } from './index.js';
import { reg } from './IdQuad.js';

export class ReceiveQuad extends Quad {
  public constructor(
    private readonly id: string,
    private readonly tempVariable: string | number
  ) {
    super();
  }

  public toString(): RA<string> {
    return [`RECEIVE ${mem(this.id)}`];
  }

  public toMips() {
    return addComment(
      [
        'addi $v0, $zero, 5',
        'syscall',
        `sw $v0, ${reg(this.tempVariable)}  # END input ${this.id}`,
      ],
      `BEGIN input ${this.id}`
    );
  }
}
