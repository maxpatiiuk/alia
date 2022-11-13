import type { RA } from '../../../utils/types.js';
import { mem, Quad } from './index.js';

export class AssignQuad extends Quad {
  public constructor(
    public readonly id: string,
    private readonly expression: RA<Quad>
  ) {
    super();
  }

  public toString() {
    return [
      ...this.expression.flatMap((quad) => quad.toString()),
      `${mem(this.id)} := ${this.expression.at(-1)!.toValue()}`,
    ];
  }

  public toValue(): string {
    return mem(this.id);
  }
}
