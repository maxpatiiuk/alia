import { MovQ } from '../../instructions/definitions/amd/MovQ.js';
import { Addi } from '../../instructions/definitions/mips/Addi.js';
import { Move } from '../../instructions/definitions/mips/Move.js';
import { Sw } from '../../instructions/definitions/mips/Sw.js';
import { NextComment } from '../../instructions/definitions/NextComment.js';
import { PrevComment } from '../../instructions/definitions/PrevComment.js';
import { Syscall } from '../../instructions/definitions/Syscall.js';
import type { QuadsContext } from '../index.js';
import { CallQuad } from './CallQuad.js';
import type { TempVariable } from './IdQuad.js';
import { Quad } from './index.js';

export class MayhemQuad extends Quad {
  private readonly tempVariable: TempVariable;

  private readonly callQuad: CallQuad;

  public constructor(context: QuadsContext) {
    super();
    this.tempVariable = context.requestTemp();
    this.callQuad = new CallQuad(context, [], 'mayhem', true, undefined);
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
      ...this.callQuad.toAmd(),
      new MovQ('%rax', this.tempVariable.toAmdValue()),
    ];
  }

  public toAmdValue() {
    return this.tempVariable.toAmdValue();
  }
}
