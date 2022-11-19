import type { RA } from '../../../utils/types.js';
import type { TempVariable } from './IdQuad.js';
import { Quad } from './index.js';

export class FormalQuad extends Quad {
  public constructor(
    public readonly id: string,
    public readonly tempVariable: TempVariable
  ) {
    super();
  }

  public toString(): RA<string> {
    return [`${this.id} (formal arg of 8 bytes)`];
  }
}
