import type { RA } from '../../../utils/types.js';
import { Quad } from './index.js';
import { labelOffset } from './LabelQuad.js';

export class LineQuad extends Quad {
  public constructor(private readonly line: string) {
    super();
  }

  public toString(): RA<string> {
    return [`${' '.repeat(labelOffset)}${this.line}`];
  }
}
