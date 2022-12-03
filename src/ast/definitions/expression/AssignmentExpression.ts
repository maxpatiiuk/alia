import type { EvalContext } from '../../eval.js';
import { ReturnValue } from '../../eval.js';
import type { QuadsContext } from '../../../quads/index.js';
import type { LanguageType, TypeCheckContext } from '../../typing.js';
import { assertType, cascadeError, ErrorType } from '../../typing.js';
import type { PrintContext } from '../../unparse.js';
import { VariableDeclaration } from '../statement/VariableDeclaration.js';
import { SyntheticToken } from '../SyntheticToken.js';
import type { IdNode } from '../term/IdNode.js';
import type { TokenNode } from '../TokenNode.js';
import { token } from '../TokenNode.js';
import { Expression } from './index.js';
import { AssignExpClass } from '../../../quads/definitions/AssignQuad.js';

export class AssignmentExpression extends Expression {
  public constructor(
    public readonly id: IdNode,
    public readonly token: TokenNode,
    public readonly expression: Expression
  ) {
    super([id, expression]);
  }

  public typeCheck(context: TypeCheckContext): LanguageType {
    const leftType = assertType(
      context,
      this.id,
      'invalidOperand',
      'int',
      'bool',
      'function'
    );
    const rightType = assertType(
      context,
      this.expression,
      'invalidOperand',
      'int',
      'bool',
      'function'
    );
    const cascadeType = cascadeError(leftType, rightType);
    return !(cascadeType instanceof ErrorType) &&
      leftType.toString() !== rightType.toString()
      ? context.reportError(this, 'invalidAssign')
      : cascadeType;
  }

  public pretty(printContext: PrintContext) {
    return [
      this.id.print(printContext),
      ' ',
      token('ASSIGN'),
      ' ',
      this.expression.print(printContext),
    ];
  }

  public getToken() {
    return new SyntheticToken(this.id).getToken();
  }

  public async evaluate(context: EvalContext) {
    const expression = await this.expression.evaluate(context);
    if (expression instanceof ReturnValue)
      throw new Error('Cannot assign to return value');

    const declaration = this.id.getDeclaration();
    if (!(declaration instanceof VariableDeclaration))
      throw new Error('Cannot assign to non-variable');

    declaration.value = expression;
    return expression;
  }

  public toQuads(context: QuadsContext) {
    return [
      new AssignExpClass(this.id, this.expression.toQuads(context), context),
    ];
  }
}
