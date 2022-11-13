import { GenericQuad } from './GenericQuad.js';
import { LabelQuad, mipsSize, Quad } from './index.js';

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
      `lw $ra, ${mipsSize * 2}($fp)  # Restore return address`,
      `lw $fp, ${mipsSize}($fp)  # Restore frame pointer`,
      `addiu $sp, $fp, ${mipsSize * 2}  # Restore the stack pointer`,
      'jr $ra # Return to caller',
      '',
    ];
  }
}
