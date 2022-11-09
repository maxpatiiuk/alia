import type { RA } from '../../utils/types.js';
import type { EvalContext } from '../eval.js';
import { evalList } from '../eval.js';
import type { LanguageType, TypeCheckContext } from '../typing.js';
import { VoidType } from '../typing.js';
import type { PrintContext } from '../unparse.js';
import { AstNode } from './AstNode.js';
import type { Expression } from './expression/index.js';
import type { FunctionDeclaration } from './FunctionDeclaration.js';
import type { StatementList } from './statement/StatementList.js';
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
}
