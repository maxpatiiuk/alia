import type { RA } from '../../../utils/types.js';
import { addComment, Quad } from './index.js';
import { StringQuad } from './StringQuad.js';
import { IdQuad } from './IdQuad.js';

export class ReportQuad extends Quad {
  public constructor(private readonly quads: RA<Quad>) {
    super();
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
    return addComment(
      [
        ...this.quads.flatMap((quad) => quad.toMips()),
        isString ? `la $a0, ${value}` : `lw $a0, ${value}`,
        `addi $v0, $zero, ${isString ? 4 : 1}`,
        'syscall  # END Output',
      ],
      'BEGIN Output'
    );
  }

  public toAmd() {
    const quad = this.quads.at(-1)!;
    const isString = quad instanceof StringQuad;
    const isBool = quad instanceof IdQuad && quad.type === 'bool';
    const value = quad.toAmdValue();
    return addComment(
      [
        `movq ${value}, %rdi`,
        `callq ${isString ? 'printString' : isBool ? 'printBool' : 'printInt'}`,
      ],
      'Output'
    );
  }
}
