import { CallQ } from '../../instructions/definitions/amd/CallQ.js';
import { MovQ } from '../../instructions/definitions/amd/MovQ.js';
import { Addi } from '../../instructions/definitions/mips/Addi.js';
import { Sw } from '../../instructions/definitions/mips/Sw.js';
import { NextComment } from '../../instructions/definitions/NextComment.js';
import { PrevComment } from '../../instructions/definitions/PrevComment.js';
import { Syscall } from '../../instructions/definitions/Syscall.js';
import type { RA } from '../../utils/types.js';
import type { TempVariable } from './IdQuad.js';
import { mem } from './IdQuad.js';
import { Quad } from './index.js';

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
    return [
      new NextComment(`BEGIN Input ${this.id}`),
      new Addi('$v0', '$zero', 5),
      new Syscall(),
      new Sw('$v0', this.tempVariable.toMipsValue()),
      new PrevComment(`END Input ${this.id}`),
    ];
  }

  public toAmd() {
    return [
      new NextComment(`BEGIN Input ${this.id}`),
      new CallQ(this.type === 'bool' ? 'getBool' : 'getInt'),
      new MovQ('%rax', this.tempVariable.toAmdValue()),
      new PrevComment(`END Input ${this.id}`),
    ];
  }
}
