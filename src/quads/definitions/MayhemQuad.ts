import { Quad } from './index.js';
import { TempVariable } from './IdQuad.js';
import { NextComment } from '../../instructions/definitions/NextComment.js';
import { PrevComment } from '../../instructions/definitions/PrevComment.js';
import { CallQ } from '../../instructions/definitions/amd/CallQ.js';
import { MovQ } from '../../instructions/definitions/amd/MovQ.js';
import { Addi } from '../../instructions/definitions/mips/Addi.js';
import { Move } from '../../instructions/definitions/mips/Move.js';
import { Syscall } from '../../instructions/definitions/Syscall.js';
import { Sw } from '../../instructions/definitions/mips/Sw.js';

export class MayhemQuad extends Quad {
  public constructor(private readonly tempVariable: TempVariable) {
    super();
  }

  public toString() {
    return [`MAYHEM ${this.tempVariable.toValue()}`];
  }

  public toValue() {
    return this.tempVariable.toValue();
  }

  public toMips() {
    return [
      new NextComment('BEGIN Mayhem'),
      new Addi('$v0', '$zero', 41),
      new Move('$a0', '$zero'),
      new Syscall(),
      new Sw('$a0', this.tempVariable.toMipsValue()),
      new PrevComment('END Mayhem'),
    ];
  }

  public toMipsValue() {
    return this.tempVariable.toMipsValue();
  }

  public toAmd() {
    return [
      new NextComment('BEGIN Mayhem'),
      new CallQ('mayhem'),
      new MovQ('%rax', this.tempVariable.toAmdValue()),
      new PrevComment('END Mayhem'),
    ];
  }

  public toAmdValue() {
    return this.tempVariable.toAmdValue();
  }
}
