import { Jmp } from '../../../instructions/definitions/amd/Jmp.js';
import { J } from '../../../instructions/definitions/mips/J.js';
import { NextComment } from '../../../instructions/definitions/NextComment.js';
import { PrevComment } from '../../../instructions/definitions/PrevComment.js';
import type { RA } from '../../../utils/types.js';
import { filterArray } from '../../../utils/types.js';
import { Quad } from './index.js';
import { LoadQuad } from './LoadQuad.js';
import { Register } from './Register.js';

export class ReturnQuad extends Quad {
  private readonly loadQuad: LoadQuad;

  public constructor(
    private readonly quads: RA<Quad> | undefined,
    private readonly returnLabel: string
  ) {
    super();
    const tempVariable =
      this.quads === undefined
        ? new Register('$zero', '$0')
        : new Register(
            this.quads.at(-1)!.toMipsValue(),
            this.quads.at(-1)!.toAmdValue()
          );
    this.loadQuad = new LoadQuad(new Register('$v0', '%rax'), tempVariable);
  }

  public toString() {
    return filterArray([
      ...(this.quads ?? []).flatMap((quad) => quad.toString()),
      typeof this.quads === 'object'
        ? `setret ${this.quads.at(-1)!.toValue()}`
        : undefined,
      `goto ${this.returnLabel}`,
    ]);
  }

  public toMips() {
    return [
      new NextComment('BEGIN Return'),
      ...(this.quads ?? []).flatMap((quad) => quad.toMips()),
      ...this.loadQuad.toMips(),
      new J(this.returnLabel),
      new PrevComment('END Return'),
    ];
  }

  public toAmd() {
    return [
      new NextComment('Return'),
      ...(this.quads ?? []).flatMap((quad) => quad.toAmd()),
      ...this.loadQuad.toAmd(),
      new Jmp(this.returnLabel),
    ];
  }
}
