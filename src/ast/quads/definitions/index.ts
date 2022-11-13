import type { RA } from '../../../utils/types.js';
import { formatTemp } from '../index.js';

export class Quad {
  /** Convert quad to a printable string */
  public toString(): RA<LabelQuad | string> {
    throw new Error('Not implemented');
  }

  /** Get the name of the temp variable created by the quad */
  public toValue(): string {
    throw new Error('Not implemented');
  }

  /** Convert Quad to MIPS instructions */
  public toMips(): RA<LabelQuad | string> {
    throw new Error('Not implemented');
  }

  /** Get the name of the temp register created by the mips instruction */
  public toMipsValue(): string {
    throw new Error('Not implemented');
  }
}

/** Wrap an identifier in square brackets (indicates memory access) */
export const mem = (id: string | number): string =>
  `[${typeof id === 'number' ? formatTemp(id) : id}]`;

export const quadsToString = (quads: RA<Quad>): RA<LabelQuad | string> =>
  quads.flatMap((quad) => (quad instanceof LabelQuad ? quad : quad.toString()));

/**
 * Number of bites used for a single value.
 * 4*8 = 32 bits
 */
export const mipsSize = 4;

/**
 * NOTE: this stateful variable needs to be reset before running compiler
 * the second time
 */
let longestLabel = 5;
export const labelPadding = 2;
export const getLongestLabel = () => longestLabel;

export class LabelQuad extends Quad {
  public constructor(
    private readonly label: string,
    private readonly quad: Quad
  ) {
    super();
    longestLabel = Math.max(longestLabel, label.length);
  }

  public toString(): RA<string> {
    return this.buildLine(this.quad.toString());
  }

  public toMips(): RA<string> {
    return this.buildLine(this.quad.toMips());
  }

  private buildLine(lines: RA<string | LabelQuad>): RA<string> {
    const label = `${this.label}:${' '.repeat(
      Math.max(0, longestLabel - this.label.length) + labelPadding
    )}`;
    if (lines.length !== 1 || typeof lines[0] !== 'string')
      throw new Error('LabelQuad called on invalid quad');
    return [`${label}${lines[0]}`];
  }
}
