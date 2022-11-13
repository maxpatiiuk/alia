import { GenericQuad } from './GenericQuad.js';
import { LabelQuad, Quad } from './index.js';
import { reg } from './IdQuad.js';

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
      `lw $ra, ${reg(2)}  # Restore return address`,
      `lw $fp, ${reg(1)}  # Restore frame pointer`,
      'jr $ra # Return to caller',
      '',
    ];
  }
}
