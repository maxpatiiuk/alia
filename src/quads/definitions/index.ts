import type { AmdInstruction } from '../../instructions/definitions/amd/index.js';
import type { MipsInstruction } from '../../instructions/definitions/mips/index.js';
import type { RA } from '../../utils/types.js';
import { Label } from '../../instructions/definitions/Label.js';
import { NextComment } from '../../instructions/definitions/NextComment.js';
import { PrevComment } from '../../instructions/definitions/PrevComment.js';

export class Quad {
  /** Convert quad to a printable string */
  public toString(): RA<Label | string> {
    throw new Error('Not implemented');
  }

  /** Get the name of the temp variable created by the quad */
  public toValue(): string {
    throw new Error('Not implemented');
  }

  /** Convert Quad to MIPS instructions */
  public toMips(): RA<MipsInstruction> {
    throw new Error('Not implemented');
  }

  /** Get the name of the temp register created by the MIPS instruction */
  public toMipsValue(): string {
    throw new Error('Not implemented');
  }

  /** Convert Quad to x64 instructions */
  public toAmd(): RA<AmdInstruction> {
    throw new Error('Not implemented');
  }

  /** Get the name of the temp register created by the x64 instruction */
  public toAmdValue(): string {
    throw new Error('Not implemented');
  }
}

export const quadsToString = (
  quads: RA<Quad | Label | string | NextComment | PrevComment>
): RA<Label | string> =>
  quads.flatMap((quad) =>
    quad instanceof PrevComment || quad instanceof NextComment
      ? []
      : quad instanceof Label
      ? quad
      : quad.toString()
  );

export const quadsToMips = (
  quads: RA<MipsInstruction | Quad>
): RA<MipsInstruction> =>
  quads.flatMap((quad) => (quad instanceof Quad ? quad.toMips() : [quad]));

export const quadsToAmd = (
  quads: RA<AmdInstruction | Quad>
): RA<AmdInstruction> =>
  quads.flatMap((quad) => (quad instanceof Quad ? quad.toAmd() : [quad]));

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
