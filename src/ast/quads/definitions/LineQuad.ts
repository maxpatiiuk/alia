import type { RA } from '../../../utils/types.js';
import { getLongestLabel, labelPadding, Quad } from './index.js';

export class LineQuad extends Quad {
  public constructor(private readonly line: string) {
    super();
  }

  public toString(): RA<string> {
    return [`${' '.repeat(getLongestLabel() + labelPadding)}${this.line}`];
  }
}
