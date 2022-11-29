/**
 * Helpers for conversion to final assembly code
 */

import type { IR, R, RA, WritableArray } from '../utils/types.js';
import { filterArray } from '../utils/types.js';
import { BlankLine } from './definitions/amd/BlankLink.js';
import { DataSection } from './definitions/DataSection.js';
import { Globl } from './definitions/Globl.js';
import type { Instruction } from './definitions/index.js';
import { Label } from './definitions/Label.js';
import { NextComment } from './definitions/NextComment.js';
import { PrevComment } from './definitions/PrevComment.js';
import { TextSection } from './definitions/TextSection.js';

/**
 * Convert x64 and MIPS instructions into an array of `Line`s.
 *
 * A line is an instruction with a label and an array of comments.
 */
export function instructionsToLines(instructions: RA<Instruction>): RA<Line> {
  let comments: WritableArray<NextComment | PrevComment> = [];

  const mergedInstructions = mergeLabels(instructions);

  // Associate prev-line comments with the non-comment non-label line before it
  const instructionsWithPrevComments = filterArray(
    Array.from(mergedInstructions)
      .reverse()
      .map((instruction) => {
        if (instruction instanceof PrevComment) {
          comments.push(instruction);
          return undefined;
        } else if (
          instruction instanceof Label ||
          instruction instanceof NextComment
        ) {
          return { lineComments: [], instruction };
        } else {
          const lineComments = comments;
          comments = [];
          return { lineComments, instruction };
        }
      })
      .reverse()
  );

  // Associate next-line comments with the non-comment non-label line after it
  const instructionsWithComments = filterArray(
    instructionsWithPrevComments.map(({ lineComments, instruction }) => {
      if (instruction instanceof NextComment) {
        comments.push(instruction);
        return undefined;
      } else if (instruction instanceof Label) {
        if (lineComments.length > 0)
          throw new Error(
            `Found comments for a label: ${comments
              .map(({ comment }) => comment)
              .join(', ')}`
          );
        return { comments: [], instruction };
      } else {
        const currentComments = [...comments, ...lineComments];
        comments = [];
        return { comments: currentComments, instruction };
      }
    })
  );

  if (comments.length > 0)
    throw new Error(
      `Found trailing comments: ${comments
        .map(({ comment }) => comment)
        .join(', ')}`
    );

  const notIndented = [BlankLine, Globl, DataSection, TextSection];
  // Associate instructions with their labels
  let label: Label | undefined = undefined;
  return filterArray(
    instructionsWithComments.map(({ comments, instruction }) => {
      if (instruction instanceof Label) {
        if (comments.length > 0)
          throw new Error(
            `Found comments for a label: ${comments
              .map(({ comment }) => comment)
              .join(', ')}`
          );
        if (label !== undefined)
          throw new Error(
            `Found two consecutive labels: ${label.label} and ${instruction.label}`
          );
        label = instruction;
        return undefined;
      } else {
        const isIndented = !notIndented.some(
          (type) => instruction instanceof type
        );
        if (!isIndented && label !== undefined)
          throw new Error(
            `Found a label for not indented line: ${label.label} (${instruction.constructor.name})`
          );
        const resolvedLabel = isIndented ? label?.label ?? '' : undefined;
        label = undefined;
        return new Line(
          resolvedLabel,
          instruction,
          comments.map(({ comment }) => comment)
        );
      }
    })
  );
}

/**
 * During instruction generation, multiple labels can be given to a single
 * instruction.
 *
 * For example, one for the closing `}` of the if statement and one of the
 * closing `}` of the `for` statement
 *
 * A single line of assembly code can only have a single label. Thus, this
 * function finds all labels that needs to be merged and calls `replaceLabels`
 * to replace all instances of one label with another.
 */
function mergeLabels(instructions: RA<Instruction>): RA<Instruction> {
  const toReplace: R<string> = {};
  let currentLabel: Label | undefined = undefined;
  const filteredLabels = filterArray(
    instructions.map((instruction) => {
      if (instruction instanceof Label) {
        if (currentLabel === undefined) {
          currentLabel = instruction;
          return instruction;
        } else toReplace[instruction.label] = currentLabel.label;
        return undefined;
      } else if (
        !(instruction instanceof NextComment) &&
        !(instruction instanceof PrevComment)
      )
        currentLabel = undefined;
      return instruction;
    })
  );
  replaceLabels(filteredLabels, toReplace);
  return filteredLabels;
}

/**
 * Replace all instances of one label with another. Used when merging labels
 * Warning: this method has side effects
 */
function replaceLabels(
  instructions: RA<Instruction>,
  toReplace: IR<string>
): RA<Instruction> {
  instructions.forEach((instruction) => {
    if (typeof instruction.label === 'string' && instruction.label in toReplace)
      instruction.label = toReplace[instruction.label];
  });
  return instructions;
}

/**
 * Joint all lines into a single string
 */
export const linesToString = (lines: RA<Line>, longestLabel: number): string =>
  lines.map((line) => line.toString(longestLabel)).join('\n');

/**
 * A line is an instruction with a label and an array of comments.
 *
 * This is the final abstraction step before the assembly code is generated.
 */
export class Line {
  public constructor(
    /**
     * Non empty label would label this line
     * Empty label would omit the label for that line
     * Passing undefined means this kind of line can never have a label. This
     * makes that line not be indented in the output code.
     */
    public readonly label: string | '' | undefined,
    public readonly instruction: Instruction,
    public readonly comments: RA<string>
  ) {}

  public toString(longestLabel: number): string {
    const label =
      this.label === undefined
        ? ''
        : (this.label === '' ? '' : `${this.label}:`).padEnd(longestLabel);
    const instruction = this.instruction.toString();
    const comments = this.comments.map((comment) => `# ${comment}`).join('  ');
    return `${label}${instruction}${
      comments.length === 0 ? '' : `  ${comments}`
    }`;
  }
}
