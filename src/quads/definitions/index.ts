import type { IRBuilder, LLVMContext, Module, Value } from 'llvm-bindings';
import type llvm from 'llvm-bindings';

import type { AmdInstruction } from '../../instructions/definitions/amd/index.js';
import { Label } from '../../instructions/definitions/Label.js';
import type { MipsInstruction } from '../../instructions/definitions/mips/index.js';
import { NextComment } from '../../instructions/definitions/NextComment.js';
import { PrevComment } from '../../instructions/definitions/PrevComment.js';
import type { IR, RA } from '../../utils/types.js';

/**
 * Base Quad class
 */
export class Quad {
  /**
   * Convert quad to a printable string
   *
   * Used when printing out the intermediate representation
   */
  public toString(): RA<Label | string> {
    throw new Error('Not implemented');
  }

  /**
   * Get the name of the temp variable created by the quad
   *
   * This is most commonly used in arithmetic and boolean operations, when
   * a parent expression needs to get the result of the subexpressions.
   *
   * Used when printing out the intermediate representation
   */
  public toValue(): string {
    throw new Error('Not implemented');
  }

  /**
   * Convert Quad to MIPS instructions
   */
  public toMips(): RA<MipsInstruction> {
    throw new Error('Not implemented');
  }

  /**
   * Get the name of the temp register created by the MIPS instruction
   *
   * This is most commonly used in arithmetic and boolean operations, when
   * a parent expression needs to get the result of the subexpressions.
   *
   * Used when generating MIPS assembly
   */
  public toMipsValue(): string {
    throw new Error('Not implemented');
  }

  /**
   * Convert Quad to x64 instructions
   *
   * Note "Amd" name is used instead of "x64" because I needed a name that
   * can be writen in PascalCase and camelCase, as well as doesn't include
   * numbers
   */
  public toAmd(): RA<AmdInstruction> {
    throw new Error('Not implemented');
  }

  /**
   * Get the name of the temp register created by the x64 instruction
   *
   * This is most commonly used in arithmetic and boolean operations, when
   * a parent expression needs to get the result of the subexpressions.
   *
   * Used when generating x64 assembly
   */
  public toAmdValue(): string {
    throw new Error('Not implemented');
  }

  /**
   * Convert Quad to LLVM IR instructions
   */
  public toLlvm(_context: LlvmContext): Value {
    throw new Error('Not implemented');
  }
}

export const quadsToString = (
  quads: RA<Label | NextComment | PrevComment | Quad | string>
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

export type LlvmContext = {
  readonly context: LLVMContext;
  readonly module: Module;
  readonly builder: IRBuilder;
  readonly validate: boolean;
  readonly strings: IR<llvm.Constant>;
};
