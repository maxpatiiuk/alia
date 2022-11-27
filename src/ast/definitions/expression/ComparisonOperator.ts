import type { EvalContext } from '../../eval.js';
import type { TypeCheckContext } from '../../typing.js';
import { assertType, BoolType, cascadeError, ErrorType } from '../../typing.js';
import type { PrintContext } from '../../unparse.js';
import { wrap, wrapChild } from '../../unparse.js';
import type { TokenNode } from '../TokenNode.js';
import { assertToken } from '../TokenNode.js';
import { Expression } from './index.js';
import { QuadsContext } from '../../../quads/index.js';
import { OperationQuad } from '../../../quads/definitions/OperationQuad.js';

export class ComparisonOperator extends Expression {
  public readonly operator: '<' | '<=' | '>' | '>=';

  public readonly token: TokenNode;

  public constructor(
    public readonly left: Expression,
    token: TokenNode,
    public readonly right: Expression
  ) {
    super([left, right]);
    this.operator = assertToken(
      token,
      'LESS',
      'LESSEQ',
      'GREATER',
      'GREATEREQ'
    );
    this.token = token;
  }

  public typeCheck(context: TypeCheckContext) {
    const type = cascadeError(
      assertType(context, this.left, 'relationalInt', 'int'),
      assertType(context, this.right, 'relationalInt', 'int')
    );
    return type instanceof ErrorType ? new ErrorType() : new BoolType();
  }

  public pretty(printContext: PrintContext) {
    return wrap(printContext, [
      wrapChild(printContext, this.left),
      ' ',
      this.operator,
      ' ',
      wrapChild(printContext, this.right),
    ]);
  }

  public getToken() {
    return this.token;
  }

  public async evaluate(context: EvalContext) {
    const left = await this.left.evaluate(context);
    const right = await this.right.evaluate(context);
    if (typeof left !== 'number' || typeof right !== 'number')
      throw new Error('Cannot perform comparison on non-numbers');
    else if (this.operator === '<') return left < right;
    else if (this.operator === '<=') return left <= right;
    else if (this.operator === '>') return left > right;
    else return left >= right;
  }

  public toQuads(context: QuadsContext) {
    return [
      new OperationQuad(
        this.left.toQuads(context),
        this.operator,
        this.right.toQuads(context),
        context
      ),
    ];
  }
}
