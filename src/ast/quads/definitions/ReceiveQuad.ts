import type { RA } from '../../../utils/types.js';
import type { TempVariable } from './IdQuad.js';
import { addComment, Quad } from './index.js';
import { mem } from './IdQuad.js';

export class ReceiveQuad extends Quad {
  public constructor(
    private readonly id: string,
    private readonly tempVariable: TempVariable,
    private readonly type: string
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
        `sw $v0, ${this.tempVariable.toMipsValue()}  # END input ${this.id}`,
      ],
      `BEGIN input ${this.id}`
    );
  }

  public toAmd() {
    return addComment(
      [
        `callq ${this.type === 'bool' ? 'getBool' : 'getInt'}`,
        `movq %rax, ${this.tempVariable.toAmdValue()}`,
      ],
      'Input'
    );
  }
}
