import type { RA } from '../../../utils/types.js';
import { Quad } from './index.js';

export const labelOffset = 12;

export class LabelQuad extends Quad {
  public constructor(
    private readonly label: string,
    private readonly quad: Quad
  ) {
    super();
  }

  public toString(): RA<string> {
    const lines = this.quad.toString();
    if (lines.length !== 1) throw new Error('LabelQuad called on invalid quad');
    return [
      `${this.label}:${' '.repeat(
        Math.max(1, labelOffset - this.label.length - 1)
      )}${lines[0]}`,
    ];
  }
}
