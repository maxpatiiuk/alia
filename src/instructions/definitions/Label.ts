import type { RA } from '../../utils/types.js';
import { Instruction } from './index.js';

export class Label extends Instruction {
  public constructor(public readonly label: string) {
    super();
  }
}

const labelPadding = 3;
export const getLongestLabel = <T>(lines: RA<Label | T>): number =>
  Math.max(
    0,
    ...lines.map((line) => (line instanceof Label ? line.label.length : 0))
  ) + labelPadding;
