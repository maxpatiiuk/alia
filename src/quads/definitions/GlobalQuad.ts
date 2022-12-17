import llvm from 'llvm-bindings';

import { FunctionDeclaration } from '../../ast/definitions/FunctionDeclaration.js';
import type { GlobalsNode } from '../../ast/definitions/GlobalsNode.js';
import { StatementList } from '../../ast/definitions/statement/StatementList.js';
import {
  toPrimitiveValue,
  VariableDeclaration,
} from '../../ast/definitions/statement/VariableDeclaration.js';
import { BlankLine } from '../../instructions/definitions/amd/BlankLink.js';
import { DataSection } from '../../instructions/definitions/DataSection.js';
import { Globl } from '../../instructions/definitions/Globl.js';
import type { Instruction } from '../../instructions/definitions/index.js';
import {
  getLongestLabel,
  Label,
} from '../../instructions/definitions/Label.js';
import { Jal } from '../../instructions/definitions/mips/Jal.js';
import { Jr } from '../../instructions/definitions/mips/Jr.js';
import { Li } from '../../instructions/definitions/mips/Li.js';
import { Move } from '../../instructions/definitions/mips/Move.js';
import { NextComment } from '../../instructions/definitions/NextComment.js';
import { declareLinkages } from '../../instructions/definitions/std/llvm.js';
import { Syscall } from '../../instructions/definitions/Syscall.js';
import { TextSection } from '../../instructions/definitions/TextSection.js';
import {
  instructionsToLines,
  linesToString,
} from '../../instructions/index.js';
import { optimizeInstructions } from '../../instructions/optimize/index.js';
import type { RA, WritableArray } from '../../utils/types.js';
import { filterArray } from '../../utils/types.js';
import type { QuadsContext } from '../index.js';
import { FunctionQuad } from './FunctionQuad.js';
import {
  formatGlobalVariable,
  GlobalVarQuad as GlobalVariableQuad,
  GlobalVarQuad,
} from './GlobalVarQuad.js';
import type { LlvmContext } from './index.js';
import { Quad, quadsToAmd, quadsToMips, quadsToString } from './index.js';
import { formatStringQuad, StringDefQuad } from './StringDefQuad.js';

export class GlobalQuad extends Quad {
  private readonly globalQuads: RA<GlobalVarQuad>;

  private readonly globalStrings: RA<StringDefQuad>;

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
              node: child,
              value: toPrimitiveValue(child.value),
            };
          } else
            return child instanceof FunctionDeclaration
              ? { node: child, value: undefined }
              : undefined;
        })
    );

    this.globalQuads = globals.map(
      ({ node, value }) => new GlobalVariableQuad(node, value)
    );

    this.functions = filterArray(
      this.children.flatMap((child) =>
        child instanceof FunctionDeclaration
          ? child.toQuads(newContext)
          : undefined
      )
    );

    this.globalStrings = strings.flatMap(
      (value) => new StringDefQuad(newContext.requestString(value), value)
    );

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
    return [
      ...quadsToString([
        '[BEGIN GLOBALS]',
        ...this.globalQuads,
        ...this.globalStrings,
        '[END GLOBALS]',
        '',
      ]),
      ...quadsToString(this.functions),
    ];
  }

  private checkForMain(): void {
    const main = this.functions.find(
      (quad): quad is FunctionQuad =>
        quad instanceof FunctionQuad && quad.id === mainFunction
    );
    if (main === undefined)
      throw new Error(
        'Conversion to assembly requires there to be a main() function. Please define it'
      );
  }

  public convertToMips(): string {
    this.checkForMain();

    const headerInstructions = [
      new Globl([startFunction]),
      new DataSection(),
      ...quadsToMips(this.globalQuads),
      ...quadsToMips(this.globalStrings),
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
    this.checkForMain();

    const headerInstructions = [
      new Globl([mainFunction]),
      new DataSection(),
      ...quadsToAmd(this.globalQuads),
      ...quadsToAmd(this.globalStrings),
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

  public convertToLlvm(debug: boolean): string {
    this.checkForMain();

    const context = new llvm.LLVMContext();
    const module = new llvm.Module('alia', context);
    const builder = new llvm.IRBuilder(context);

    const partialContext: LlvmContext = {
      context,
      module,
      builder,
      validate: !debug,
      strings: {},
    };

    const globalContext: LlvmContext = {
      ...partialContext,
      strings: Object.fromEntries(
        this.globalStrings.map((quad) => [
          quad.name,
          quad.toLlvm(partialContext),
        ])
      ),
    };

    declareLinkages(globalContext);

    [
      ...this.globalQuads.filter(
        (quad) =>
          !(quad instanceof GlobalVarQuad) || typeof quad.value === 'number'
      ),
      ...this.globalStrings,
      ...this.functions,
    ].forEach((quad) => quad.toLlvm(globalContext));

    if (llvm.verifyModule(module) && !debug)
      throw new Error('Verifying LLVM module failed');

    return module.print();
  }
}

const startFunction = '_start';
export const mainFunction = 'main';
export const getPcHelper = '_get_pc';

export function inlineLabels(lines: RA<Label | string>): RA<string> {
  const longestLabel = getLongestLabel(lines);
  return lines.map((line) =>
    line instanceof Label
      ? `${`${line.label}:`.padEnd(longestLabel, ' ')}nop`
      : `${''.padEnd(longestLabel, ' ')}${line}`
  );
}
