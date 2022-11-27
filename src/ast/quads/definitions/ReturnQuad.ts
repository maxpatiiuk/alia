import type { RA } from '../../../utils/types.js';
import { filterArray } from '../../../utils/types.js';
import { addComment, Quad } from './index.js';
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
    return addComment(
      [
        ...(this.quads ?? []).flatMap((quad) => quad.toMips()),
        ...this.loadQuad.toMips(),
        `j ${this.returnLabel}`,
      ],
      `Return`
    );
  }

  public toAmd() {
    return addComment(
      [
        ...(this.quads ?? []).flatMap((quad) => quad.toAmd()),
        ...this.loadQuad.toAmd(),
        `jmp ${this.returnLabel}`,
      ],
      `Return`
    );
  }
}
