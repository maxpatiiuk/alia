import type { RA } from '../../utils/types.js';
import { filterArray } from '../../utils/types.js';
import type { EvalContext } from '../eval.js';
import { evalList } from '../eval.js';
import type { Quad } from '../quads/definitions.js';
import { GlobalQuad } from '../quads/definitions.js';
import type { QuadsContext } from '../quads/index.js';
import type { LanguageType, TypeCheckContext } from '../typing.js';
import { VoidType } from '../typing.js';
import type { PrintContext } from '../unparse.js';
import { AstNode } from './AstNode.js';
import type { Expression } from './expression/index.js';
import { FunctionDeclaration } from './FunctionDeclaration.js';
import { StatementList } from './statement/StatementList.js';
import { VariableDeclaration } from './statement/VariableDeclaration.js';
import { token } from './TokenNode.js';

export class GlobalsNode extends AstNode {
  public constructor(
    public readonly children: RA<
      Expression | FunctionDeclaration | StatementList | VariableDeclaration
    >
  ) {
    super([]);
  }

  public pretty(printContext: PrintContext) {
    return this.children.flatMap((child, index, { length }) => [
      child.print(printContext),
      child instanceof VariableDeclaration ? `${token('SEMICOL')}` : '',
      index + 1 === length ? '' : '\n',
    ]);
  }

  public typeCheck(context: TypeCheckContext): LanguageType {
    this.children.forEach((child) => child.typeCheck(context));
    return new VoidType();
  }

  public async evaluate(context: EvalContext) {
    return evalList(context, this.children);
  }

  public toQuads(context: QuadsContext): RA<Quad> {
    // eslint-disable-next-line functional/prefer-readonly-type
    const strings: { readonly name: string; readonly value: string }[] = [];
    const newContext: QuadsContext = {
      ...context,
      requestString(value) {
        const name = context.requestString(value);
        strings.push({ name, value });
        return name;
      },
    };
    const functions = filterArray(
      this.children.flatMap((child) =>
        child instanceof FunctionDeclaration
          ? child.toQuads(newContext)
          : undefined
      )
    );
    return [
      new GlobalQuad(
        filterArray(
          this.children
            .flatMap((child) =>
              child instanceof StatementList ? child.children : [child]
            )
            .map((child) =>
              child instanceof VariableDeclaration ||
              child instanceof FunctionDeclaration
                ? child.id.getName()
                : undefined
            )
        ),
        strings
      ),
      ...functions,
    ];
  }
}
