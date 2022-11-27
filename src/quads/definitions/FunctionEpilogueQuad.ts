import { reg } from './IdQuad.js';
import { Quad } from './index.js';
import { Leave } from '../../instructions/definitions/amd/Leave.js';
import { RetQ } from '../../instructions/definitions/amd/RetQ.js';
import { BlankLine } from '../../instructions/definitions/amd/BlankLink.js';
import { Lw } from '../../instructions/definitions/mips/Lw.js';
import { NextComment } from '../../instructions/definitions/NextComment.js';
import { Jr } from '../../instructions/definitions/mips/Jr.js';
import { Label } from '../../instructions/definitions/Label.js';

export class FunctionEpilogueQuad extends Quad {
  private readonly leave: Label;

  public constructor(leaveLabel: string, private readonly id: string) {
    super();

    this.leave = new Label(leaveLabel);
  }

  public toString() {
    return [...this.leave.toString(), `leave ${this.id}`];
  }

  public toMips() {
    return [
      this.leave,
      new NextComment('Restore return address'),
      new Lw('$ra', reg(2)),
      new NextComment('Restore frame pointer'),
      new Lw('$fp', reg(1)),
      new NextComment('Return to caller'),
      new Jr('$ra'),
      new BlankLine(),
    ];
  }

  public toAmd() {
    return [this.leave, new Leave(), new RetQ(), new BlankLine()];
  }
}
