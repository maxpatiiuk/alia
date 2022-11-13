import type { RA } from '../../../utils/types.js';
import { filterArray } from '../../../utils/types.js';
import { addComment, Quad } from './index.js';
import { LoadQuad } from './LoadQuad.js';

export class ReturnQuad extends Quad {
  private readonly loadQuad: LoadQuad | undefined;

  public constructor(
    private readonly quads: RA<Quad> | undefined,
    private readonly returnLabel: string
  ) {
    super();
    const tempVariable = this.quads?.at(-1)?.toMipsValue();
    this.loadQuad =
      tempVariable === undefined
        ? undefined
        : new LoadQuad('$v0', tempVariable);
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
        ...(this.loadQuad?.toMips() ?? [
          `move $v0, ${this.quads?.at(-1)?.toMipsValue() ?? '$zero'}`,
        ]),
      ],
      `Return`
    );
  }
}
