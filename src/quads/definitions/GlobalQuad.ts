import type { RA, WritableArray } from '../../utils/types.js';
import { filterArray } from '../../utils/types.js';
import { FunctionDeclaration } from '../../ast/definitions/FunctionDeclaration.js';
import type { GlobalsNode } from '../../ast/definitions/GlobalsNode.js';
import { StatementList } from '../../ast/definitions/statement/StatementList.js';
import {
  toPrimitiveValue,
  VariableDeclaration,
} from '../../ast/definitions/statement/VariableDeclaration.js';
import type { QuadsContext } from '../index.js';
import { FunctionQuad } from './FunctionQuad.js';
import {
  formatGlobalVariable,
  GlobalVarQuad as GlobalVariableQuad,
} from './GlobalVarQuad.js';
import { Quad, quadsToAmd, quadsToMips, quadsToString } from './index.js';
import { formatStringQuad, StringDefQuad } from './StringDefQuad.js';
import { Globl } from '../../instructions/definitions/Globl.js';
import { DataSection } from '../../instructions/definitions/DataSection.js';
import { TextSection } from '../../instructions/definitions/TextSection.js';
import {
  getLongestLabel,
  Label,
} from '../../instructions/definitions/Label.js';
import { Jr } from '../../instructions/definitions/mips/Jr.js';
import { Syscall } from '../../instructions/definitions/Syscall.js';
import { BlankLine } from '../../instructions/definitions/amd/BlankLink.js';
import { Jal } from '../../instructions/definitions/mips/Jal.js';
import { Instruction } from '../../instructions/definitions/index.js';
import { NextComment } from '../../instructions/definitions/NextComment.js';
import { Li } from '../../instructions/definitions/mips/Li.js';
import { Move } from '../../instructions/definitions/mips/Move.js';
import {
  instructionsToLines,
  linesToString,
} from '../../instructions/index.js';
import { optimizeInstructions } from '../../instructions/optimize/index.js';

// FIXME: add tests
// FIXME: do manual test using the mips test program
// FIXME: fix failing tests
export class GlobalQuad extends Quad {
  private readonly globalQuads: RA<Quad>;

  private readonly functions: RA<Quad>;

  private readonly mipsBootloader: RA<Instruction>;

  private readonly optimize: boolean;

  public constructor(
    private readonly children: GlobalsNode['children'],
    context: QuadsContext
  ) {
    super();

    this.optimize = context.optimize;

    const strings: WritableArray<string> = [];

    const newContext: QuadsContext = {
      ...context,
      requestString(value) {
        const index = strings.indexOf(value);
        if (index !== -1) return formatStringQuad(index);
        strings.push(value);
        return formatStringQuad(strings.length - 1);
      },
    };

    const globals = filterArray(
      this.children
        .flatMap((child) =>
          child instanceof StatementList ? child.children : [child]
        )
        .map((child) => {
          if (child instanceof VariableDeclaration) {
            child.toQuads(newContext);
            return {
              name: child.id.getName(),
              value: toPrimitiveValue(child.value),
            };
          } else
            return child instanceof FunctionDeclaration
              ? { name: child.id.getName(), value: undefined }
              : undefined;
        })
    );

    const globalQuads = globals.map(
      ({ name, value }) => new GlobalVariableQuad(name, value)
    );

    this.functions = filterArray(
      this.children.flatMap((child) =>
        child instanceof FunctionDeclaration
          ? child.toQuads(newContext)
          : undefined
      )
    );

    const stringQuads = strings.flatMap(
      (value) => new StringDefQuad(newContext.requestString(value), value)
    );
    this.globalQuads = [...globalQuads, ...stringQuads];

    this.mipsBootloader = [
      new Label(startFunction),
      new Jal(formatGlobalVariable(mainFunction)),
      new NextComment('Exit syscall'),
      new Li('$v0', 10),
      new Syscall(),
      new BlankLine(),
      new Label(getPcHelper),
      new NextComment('A helper function for getting current PC'),
      new Move('$v0', '$ra'),
      new Jr('$ra'),
    ];
  }

  public toString() {
    return inlineLabels(
      quadsToString([
        '[BEGIN GLOBALS]',
        ...this.globalQuads,
        '[END GLOBALS]',
        ...this.functions,
      ])
    );
  }

  public convertToMips(): string {
    const main = this.functions.find(
      (quad): quad is FunctionQuad =>
        quad instanceof FunctionQuad && quad.id === mainFunction
    );
    if (main === undefined)
      throw new Error(
        'Conversion to MIPS requires there to be a main() function. Please define it'
      );

    const headerInstructions = [
      new Globl([startFunction]),
      new DataSection(),
      ...quadsToMips(this.globalQuads),
      new TextSection(),
      ...quadsToMips(this.mipsBootloader),
      new BlankLine(),
    ];
    const functionInstructions = this.functions.map((quad) => quad.toMips());

    const longestLabel = getLongestLabel([
      ...headerInstructions,
      ...functionInstructions.flat(),
    ]);

    return linesToString(
      [
        ...instructionsToLines(headerInstructions),
        ...functionInstructions.flatMap((quad) => {
          const lines = instructionsToLines(quad);
          // Optimize each function in isolation
          return this.optimize ? optimizeInstructions(lines) : lines;
        }),
      ],
      longestLabel
    );
  }

  public convertToAmd(): string {
    const main = this.functions.find(
      (quad): quad is FunctionQuad =>
        quad instanceof FunctionQuad && quad.id === mainFunction
    );
    if (main === undefined)
      throw new Error(
        'Conversion to x64 requires there to be a main() function. Please define it'
      );

    const headerInstructions = [
      new Globl([mainFunction]),
      new DataSection(),
      ...quadsToAmd(this.globalQuads),
      new TextSection(),
    ];
    const functionInstructions = this.functions.map((quad) => quad.toAmd());

    const longestLabel = getLongestLabel([
      ...headerInstructions,
      ...functionInstructions.flat(),
    ]);

    return linesToString(
      [
        ...instructionsToLines(headerInstructions),
        ...functionInstructions.flatMap((quad) => {
          const lines = instructionsToLines(quad);
          // Optimize each function in isolation
          return this.optimize ? optimizeInstructions(lines) : lines;
        }),
      ],
      longestLabel
    );
  }
}

const startFunction = '_start';
export const mainFunction = 'main';
export const getPcHelper = '_get_pc';

function inlineLabels(lines: RA<Label | string>): RA<string> {
  const longestLabel = getLongestLabel(lines);
  return lines.map((line) =>
    line instanceof Label
      ? `${`${line.label}:`.padEnd(longestLabel, ' ')}nop`
      : `${''.padEnd(longestLabel + 1, ' ')}${line}`
  );
}
