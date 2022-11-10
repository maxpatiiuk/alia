import { indentation } from '../../../unparseParseTree/index.js';
import type { RA } from '../../../utils/types.js';
import type { EvalContext, EvalReturnValue } from '../../eval.js';
import { evalList } from '../../eval.js';
import type { Quad } from '../../quads/definitions.js';
import type { QuadsContext } from '../../quads/index.js';
import type { LanguageType, TypeCheckContext } from '../../typing.js';
import { VoidType } from '../../typing.js';
import type { PrintContext } from '../../unparse.js';
import { AstNode } from '../AstNode.js';
import { token } from '../TokenNode.js';
import { BlockStatement } from './block/index.js';
import type { Statement } from './index.js';

export class StatementList extends AstNode {
  public constructor(public readonly children: RA<Statement>) {
    super(children);
  }

  public pretty(printContext: PrintContext): RA<string> | string {
    return this.children.flatMap((child, index, { length }) => [
      indentation.repeat(printContext.indent),
      child.print(printContext),
      child instanceof BlockStatement ? '' : token('SEMICOL'),
      index + 1 === length ? '' : '\n',
    ]);
  }

  public typeCheck(context: TypeCheckContext): LanguageType {
    this.children.forEach((child) => child.typeCheck(context));
    return new VoidType();
  }

  public async evaluate(context: EvalContext): Promise<EvalReturnValue> {
    return evalList(context, this.children);
  }

  public toQuads(context: QuadsContext): RA<Quad> {
    return this.children.flatMap((statement) => statement.toQuads(context));
  }
}
