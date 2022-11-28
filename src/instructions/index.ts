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

export function instructionsToLines(instructions: RA<Instruction>): RA<Line> {
  let comments: WritableArray<NextComment | PrevComment> = [];

  const mergedInstructions = mergeLabels(instructions);

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

export const linesToString = (lines: RA<Line>, longestLabel: number): string =>
  lines.map((line) => line.toString(longestLabel)).join('\n');

export class Line {
  public constructor(
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
