import { MovQ } from '../../instructions/definitions/amd/MovQ.js';
import { Addi } from '../../instructions/definitions/mips/Addi.js';
import { La } from '../../instructions/definitions/mips/La.js';
import { Lw } from '../../instructions/definitions/mips/Lw.js';
import { NextComment } from '../../instructions/definitions/NextComment.js';
import { PrevComment } from '../../instructions/definitions/PrevComment.js';
import { Syscall } from '../../instructions/definitions/Syscall.js';
import type { RA } from '../../utils/types.js';
import type { QuadsContext } from '../index.js';
import { CallQuad } from './CallQuad.js';
import { IdQuad } from './IdQuad.js';
import { Quad } from './index.js';
import { StringQuad } from './StringQuad.js';

export class ReportQuad extends Quad {
  private readonly callQuad: CallQuad;

  public constructor(private readonly quads: RA<Quad>, context: QuadsContext) {
    super();
    const quad = this.quads.at(-1)!;
    const isString = quad instanceof StringQuad;
    const isBool = quad instanceof IdQuad && quad.type === 'bool';
    this.callQuad = new CallQuad(
      context,
      [],
      isString ? 'printString' : isBool ? 'printBool' : 'printInt',
      true,
      undefined
    );
  }

  public toString() {
    return [
      ...this.quads.flatMap((quad) => quad.toString()),
      `REPORT ${this.quads.at(-1)!.toValue()}`,
    ];
  }

  public toMips() {
    const isString = this.quads.at(-1) instanceof StringQuad;
    const value = this.quads.at(-1)!.toMipsValue();
    return [
      new NextComment('BEGIN Output'),
      ...this.quads.flatMap((quad) => quad.toMips()),
      new (isString ? La : Lw)('$a0', value),
      new Addi('$v0', '$zero', isString ? 4 : 1),
      new Syscall(),
      new PrevComment('END Output'),
    ];
  }

  public toAmd() {
    const quad = this.quads.at(-1)!;
    const value = quad.toAmdValue();
    return [
      new NextComment('BEGIN Output'),
      ...this.quads.flatMap((quad) => quad.toAmd()),
      new MovQ(value, '%rdi'),
      ...this.callQuad.toAmd(),
      new PrevComment('END Output'),
    ];
  }
}
