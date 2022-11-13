import { GenericQuad } from './GenericQuad.js';
import { LabelQuad, Quad } from './index.js';

export class FunctionEpilogueQuad extends Quad {
  private readonly leave: LabelQuad;

  public constructor(leaveLabel: string, private readonly id: string) {
    super();

    this.leave = new LabelQuad(
      leaveLabel,
      new GenericQuad({
        quad: `leave ${this.id}`,
        mips: 'nop',
      })
    );
  }

  public toString() {
    return this.leave.toString();
  }

  public toMips() {
    return [
      this.leave,
      'lw $ra, 8($fp)  # Restore return address',
      'lw $fp, 4($fp)  # Restore frame pointer',
      'addiu $sp, $fp, 8  # Restore the stack pointer',
      'jr $ra # Return to caller',
      '',
    ];
  }
}
