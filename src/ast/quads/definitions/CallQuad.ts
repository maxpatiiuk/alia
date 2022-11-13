import type { RA } from '../../../utils/types.js';
import { Quad } from './index.js';
import { SetArgQuad as SetArgumentQuad } from './SetArgQuad.js';

export class CallQuad extends Quad {
  private readonly quads: RA<Quad>;

  public constructor(actuals: RA<RA<Quad>>, private readonly name: string) {
    super();
    this.quads = actuals.flatMap((actual, index) => [
      ...actual,
      new SetArgumentQuad(index + 1, actual.at(-1)!.toValue()),
    ]);
  }

  public toString() {
    return [
      ...this.quads.flatMap((quad) => quad.toString()),
      `call ${this.name}`,
    ];
  }
}
