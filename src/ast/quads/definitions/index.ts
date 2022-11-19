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

  /** Get the name of the temp register created by the MIPS instruction */
  public toMipsValue(): string {
    throw new Error('Not implemented');
  }

  /** Convert Quad to x64 instructions */
  public toAmd(): RA<LabelQuad | string> {
    throw new Error('Not implemented');
  }

  /** Get the name of the temp register created by the x64 instruction */
  public toAmdValue(): string {
    throw new Error('Not implemented');
  }
}

/** Wrap an identifier in square brackets (indicates memory access) */
export const mem = (id: number | string): string =>
  `[${typeof id === 'number' ? formatTemp(id) : id}]`;

export const quadsToString = (
  quads: RA<Quad | string>
): RA<LabelQuad | string> =>
  quads.flatMap((quad) => (quad instanceof LabelQuad ? quad : quad.toString()));

export const quadsToMips = (quads: RA<Quad | string>): RA<LabelQuad | string> =>
  quads.flatMap((quad) =>
    quad instanceof LabelQuad
      ? quad
      : typeof quad === 'object'
      ? quad.toMips()
      : [quad]
  );

export const quadsToAmd = (quads: RA<Quad | string>): RA<LabelQuad | string> =>
  quads.flatMap((quad) =>
    quad instanceof LabelQuad
      ? quad
      : typeof quad === 'object'
      ? quad.toAmd()
      : [quad]
  );

/**
 * Number of bytes used for a single value in MIPS architecture
 * 4*8 = 32 bits
 */
export const mipsSize = 4;

/**
 * Number of bytes used for a single value in x64 architecture
 * 8*8 = 64 bits
 */
export const amdSize = 8;

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

  public toAmd(): RA<string> {
    return this.buildLine(this.quad.toAmd());
  }

  private buildLine(lines: RA<LabelQuad | string>): RA<string> {
    const label = `${this.label}:${' '.repeat(
      Math.max(0, longestLabel - this.label.length) + labelPadding
    )}`;
    if (lines.length === 0) return [label];
    if (lines.length !== 1 || typeof lines[0] !== 'string')
      throw new Error('LabelQuad called on invalid quad');
    return [`${label}${lines[0] ?? ''}`];
  }
}

export const addComment = (
  lines: RA<LabelQuad | string>,
  comment: string
): RA<LabelQuad | string> =>
  typeof lines[0] === 'string'
    ? [`${lines[0]}  # ${comment}`, ...lines.slice(1)]
    : [`# ${comment}`, ...lines];
