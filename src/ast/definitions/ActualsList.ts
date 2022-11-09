import type { RA } from '../../utils/types.js';
import type { PrintContext } from '../unparse.js';
import { AstNode } from './AstNode.js';
import type { Expression } from './expression/index.js';
import { token } from './TokenNode.js';

export class ActualsList extends AstNode {
  public constructor(public readonly expressions: RA<Expression>) {
    super(expressions);
  }

  public pretty(printContext: PrintContext) {
    return this.expressions
      .map((expression) => expression.print(printContext))
      .join(`${token('COMMA')} `);
  }
}
