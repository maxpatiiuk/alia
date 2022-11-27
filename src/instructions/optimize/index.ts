import type { RA, WritableArray } from '../../utils/types.js';
import { Jmp } from '../definitions/amd/Jmp.js';
import type { Instruction } from '../definitions/index.js';
import { J } from '../definitions/mips/J.js';
import { Line } from '../index.js';
import { MovQ } from '../definitions/amd/MovQ.js';
import { filterArray } from '../../utils/types.js';
import { Sw } from '../definitions/mips/Sw.js';
import { Lw } from '../definitions/mips/Lw.js';
import { Move } from '../definitions/mips/Move.js';

/** A typescript helper for increased type safety */
const define = <
  T extends new (...args: RA<any>) => Instruction = new (
    ...args: RA<any>
  ) => Instruction
>(
  instruction: T,
  callback: (instruction: InstanceType<T>, lines: RA<Line>) => RA<Line>
) => ({
  instruction: instruction as new (...args: RA<any>) => Instruction,
  callback: callback as (
    instruction: Instruction,
    lines: RA<Line>
  ) => WritableArray<Line>,
});

// FIXME: test all of these optimizations
// FIXME: add optimizations for movq movq and sw lw
const peepHoleOptimizations: RA<ReturnType<typeof define>> = [
  // Remove jumps to next instruction
  define(J, (instruction, lines) =>
    lines.at(1)?.label === instruction.label ? lines.slice(1) : lines
  ),
  // Remove jumps to next instruction
  define(Jmp, (instruction, lines) =>
    lines.at(1)?.label === instruction.label ? lines.slice(1) : lines
  ),
  // Remove save followed by load
  define(MovQ, (instruction, lines) => {
    const nextInstruction = lines.at(1)?.instruction;
    return nextInstruction instanceof MovQ &&
      instruction.destination === nextInstruction.source
      ? [
          mergeLines(
            lines.slice(0, 2),
            new MovQ(instruction.source, nextInstruction.destination)
          ),
          ...lines.slice(2),
        ]
      : lines;
  }),
  // Remove save followed by load
  define(Sw, (instruction, lines) => {
    const nextInstruction = lines.at(1)?.instruction;
    return nextInstruction instanceof Lw &&
      instruction.destination === nextInstruction.source
      ? [
          mergeLines(
            lines.slice(0, 2),
            new MovQ(instruction.source, nextInstruction.destination)
          ),
          ...lines.slice(2),
        ]
      : lines;
  }),
  // FIXME: test a=b (including global to global)
  // FIXME: test temporary dead zone
  // Get rid of useless movq
  define(MovQ, (instruction, lines) =>
    instruction.destination === instruction.source ? lines.slice(1) : lines
  ),
  // Get rid of useless move
  define(Move, (instruction, lines) =>
    instruction.destination === instruction.source ? lines.slice(1) : lines
  ),
];

export function optimizeInstructions(lines: RA<Line>): RA<Line> {
  const optimizedLines: WritableArray<Line> = [];
  let rawLines = lines.slice();
  while (rawLines.length > 0) {
    peepHoleOptimizations.forEach(({ instruction, callback }) => {
      if (rawLines[0].instruction instanceof instruction)
        rawLines = callback(rawLines[0].instruction, rawLines);
    });
    const nextLine = rawLines.shift();
    if (nextLine !== undefined) optimizedLines.push(nextLine);
  }
  return optimizedLines;
}

/**
 * Replace several lines with a new line, while carrying over the comments and
 * the label if present
 */
function mergeLines(lines: RA<Line>, instruction: Instruction): Line {
  const comments = lines.flatMap(({ comments }) => comments);
  const labels = filterArray(lines.map(({ label }) => label)).filter(
    (label) => label.length > 0
  );
  if (labels.length > 1)
    throw new Error('Unable to merge lines as they have more than one label');
  return new Line(labels[0] ?? '', instruction, comments);
}
