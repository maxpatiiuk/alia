import type { RA, WritableArray } from '../../../utils/types.js';
import { filterArray } from '../../../utils/types.js';
import { FunctionDeclaration } from '../../definitions/FunctionDeclaration.js';
import type { GlobalsNode } from '../../definitions/GlobalsNode.js';
import { StatementList } from '../../definitions/statement/StatementList.js';
import {
  toPrimitiveValue,
  VariableDeclaration,
} from '../../definitions/statement/VariableDeclaration.js';
import type { QuadsContext } from '../index.js';
import { FunctionQuad } from './FunctionQuad.js';
import {
  formatGlobalVariable,
  GlobalVarQuad as GlobalVariableQuad,
} from './GlobalVarQuad.js';
import {
  LabelQuad,
  Quad,
  quadsToAmd,
  quadsToMips,
  quadsToString,
} from './index.js';
import { formatStringQuad, StringDefQuad } from './StringDefQuad.js';
import { UniversalQuad } from './UniversalQuad.js';
import { LineQuad } from './LineQuad.js';

// FIXME: add tests
// FIXME: do manual test using the mips test program
// FIXME: fix failing tests
// FIXME: do the optimization for t7
export class GlobalQuad extends Quad {
  private readonly globalQuads: RA<Quad>;

  private readonly functions: RA<Quad>;

  private readonly mipsBootloader: RA<Quad | string>;

  public constructor(
    private readonly children: GlobalsNode['children'],
    context: QuadsContext
  ) {
    super();

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
      new LabelQuad(startFunction),
      new UniversalQuad(`jal ${formatGlobalVariable(mainFunction)}`),
      'li $v0, 10  # Exit syscall',
      'syscall',
      '',
      new LabelQuad(getPcHelper),
      new UniversalQuad(
        'move $v0, $ra  # A helper function for getting current PC'
      ),
      'jr $ra',
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

  public toMips() {
    const main = this.functions.find(
      (quad): quad is FunctionQuad =>
        quad instanceof FunctionQuad && quad.id === mainFunction
    );
    if (main === undefined)
      throw new Error(
        'Conversion to MIPS requires there to be a main() function. Please define it'
      );
    return [
      `.globl ${startFunction}`,
      '.data',
      ...inlineLabels(quadsToMips(this.globalQuads)),
      '.text',
      ...inlineLabels(
        quadsToMips([...this.mipsBootloader, '', ...this.functions])
      ),
    ];
  }

  public toAmd() {
    const main = this.functions.find(
      (quad): quad is FunctionQuad =>
        quad instanceof FunctionQuad && quad.id === mainFunction
    );
    if (main === undefined)
      throw new Error(
        'Conversion to x64 requires there to be a main() function. Please define it'
      );
    return [
      `.globl ${mainFunction}`,
      '.data',
      ...inlineLabels(quadsToAmd(this.globalQuads)),
      '.text',
      ...inlineLabels(quadsToAmd(this.functions)),
    ];
  }
}

const startFunction = '_start';
export const mainFunction = 'main';
export const getPcHelper = '_get_pc';

function inlineLabels(lines: RA<LabelQuad | string>): RA<string> {
  let currentLabel: LabelQuad | undefined = undefined;
  const newLines = filterArray(
    lines.flatMap((line) => {
      if (line instanceof LabelQuad) {
        if (currentLabel !== undefined)
          throw new Error('Cannot have two labels in a row');
        currentLabel = line;
        return undefined;
      }
      if (currentLabel === undefined) return new LineQuad(line).toString();
      const fullLine = currentLabel.inline(line);
      currentLabel = undefined;
      return [fullLine];
    })
  );
  if (currentLabel !== undefined) throw new Error('Unexpected trailing label');
  return newLines;
}
