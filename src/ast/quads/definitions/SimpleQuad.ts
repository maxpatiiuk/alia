import type { RA } from '../../../utils/types.js';
import { Quad } from './index.js';

export class SimpleQuad extends Quad {
  public constructor(
    public readonly name: string,
    private readonly operation: string
  ) {
    super();
  }

  public toString(): RA<string> {
    return [`${this.name} ${this.operation}`];
  }
}
