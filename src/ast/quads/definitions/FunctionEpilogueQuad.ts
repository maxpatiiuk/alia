import { reg } from './IdQuad.js';
import { amdSize, LabelQuad, Quad } from './index.js';

export class FunctionEpilogueQuad extends Quad {
  private readonly leave: LabelQuad;

  public constructor(leaveLabel: string, private readonly id: string) {
    super();

    this.leave = new LabelQuad(leaveLabel);
  }

  public toString() {
    return [...this.leave.toString(), `leave ${this.id}`];
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

  public toAmd() {
    return [this.leave, `addq $${amdSize * 2}, %rsp`, 'popq %rbp', 'retq', ''];
  }
}
