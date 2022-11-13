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
import { PrintQuad } from './GenericQuad.js';
import { GlobalVarQuad as GlobalVariableQuad } from './GlobalVarQuad.js';
import { Quad, quadsToString } from './index.js';
import { formatStringQuad, StringQuad } from './StringQuad.js';

export class GlobalQuad extends Quad {
  private readonly globalQuads: RA<Quad>;

  private readonly functions: RA<Quad>;

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
        .map((child) =>
          child instanceof VariableDeclaration
            ? { name: child.id.getName(), value: toPrimitiveValue(child.value) }
            : child instanceof FunctionDeclaration
            ? { name: child.id.getName(), value: undefined }
            : undefined
        )
    );

    this.functions = filterArray(
      this.children.flatMap((child) =>
        child instanceof FunctionDeclaration
          ? child.toQuads(newContext)
          : undefined
      )
    );

    this.globalQuads = [
      ...globals.map(({ name, value }) => new GlobalVariableQuad(name, value)),
      ...strings.flatMap((value, index) => new StringQuad(index, value)),
    ];
  }

  public toString() {
    return quadsToString([
      new PrintQuad('[BEGIN GLOBALS]'),
      ...this.globalQuads,
      new PrintQuad('[END GLOBALS]'),
      ...this.functions,
    ]);
  }

  public toMips(): RA<string> {
    const main = this.functions.find(
      (quad): quad is FunctionQuad =>
        quad instanceof FunctionQuad && quad.id === 'main'
    );
    if (main === undefined)
      throw new Error(
        'Conversion to MIPS requires there to be a main() function. Please define it'
      );
    return [
      `.globl ${main.name}`,
      '.data',
      ...this.globalQuads.flatMap((quad) => quad.toMips()),
      '.text',
      ...main.toMips(),
      ...this.functions.flatMap((quad) => (quad === main ? [] : quad.toMips())),
    ];
  }
}
