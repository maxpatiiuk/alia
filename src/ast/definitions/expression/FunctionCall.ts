import type { WritableArray } from '../../../utils/types.js';
import type { EvalContext, EvalValue } from '../../eval.js';
import { ReturnValue } from '../../eval.js';
import type { FunctionType, TypeCheckContext } from '../../typing.js';
import { assertType, ErrorType } from '../../typing.js';
import type { PrintContext } from '../../unparse.js';
import type { ActualsList } from '../ActualsList.js';
import { FunctionDeclaration } from '../FunctionDeclaration.js';
import type { IdNode } from '../term/IdNode.js';
import type { TokenNode } from '../TokenNode.js';
import { token } from '../TokenNode.js';
import { Expression } from './index.js';
import { QuadsContext } from '../../quads/index.js';
import { CallQuad } from '../../quads/definitions/CallQuad.js';
import { GetRetQuad } from '../../quads/definitions/GetRetQuad.js';
import { IntLiteralQuad } from '../../quads/definitions/IntLiteralQuad.js';

export class FunctionCall extends Expression {
  public constructor(
    public readonly id: IdNode,
    public readonly actualsList: ActualsList,
    token: TokenNode
  ) {
    super([id, actualsList, token]);
  }

  public typeCheck(context: TypeCheckContext) {
    const functionType = assertType(
      context,
      this.id,
      'nonFuncCall',
      'function'
    ) as ErrorType | FunctionType;
    if (functionType instanceof ErrorType) return functionType;

    const actuals = this.actualsList.children;
    const formals = functionType.type.typeList.children;
    if (actuals.length === formals.length)
      this.actualsList.children.forEach((child, index) => {
        const type = child.typeCheck(context);
        if (type.toString() !== formals[index].typeCheck(context).toString())
          context.reportError(child, 'argType');
      });
    else context.reportError(this, 'argLength');

    return functionType.type.returnType.typeCheck(context);
  }

  public getToken() {
    return this.id.getToken();
  }

  public pretty(printContext: PrintContext) {
    return [
      this.id.print({ ...printContext, mode: 'pretty' }),
      printContext.mode === 'nameAnalysis' ? this.printType(printContext) : '',
      token('LPAREN'),
      this.actualsList.print(printContext),
      token('RPAREN'),
    ];
  }

  public printType(printContext: PrintContext) {
    const declaration = this.id.getDeclaration()!;
    return declaration.printType(printContext);
  }

  public async evaluate(context: EvalContext) {
    const declaration = this.id.getDeclaration();
    if (declaration === undefined)
      throw new Error('Cannot call undefined function');

    const actuals: WritableArray<EvalValue> = [];
    for (const child of this.actualsList.children) {
      const value = await child.evaluate(context);
      if (value instanceof ReturnValue)
        throw new Error('Unexpected return value');
      actuals.push(value);
    }

    const localContext = { ...context, onReturnCalled: () => undefined };
    if (declaration instanceof FunctionDeclaration)
      return declaration.call(localContext, actuals);
    else if (declaration.value instanceof FunctionDeclaration)
      return declaration.value.call(localContext, actuals);
    else throw new Error('Cannot call non-function');
  }

  toPartialQuads(context: QuadsContext) {
    const declaration = this.id.getDeclaration();
    if (declaration === undefined)
      throw new Error('Cannot call undefined function');
    let argumentCount = this.actualsList.expressions.length;
    if (declaration instanceof FunctionDeclaration)
      argumentCount = declaration.formals.children.length;
    else if (declaration.value instanceof FunctionDeclaration)
      argumentCount = declaration.value.formals.children.length;
    else throw new Error('Cannot call non-function');
    return [
      new CallQuad(
        context,
        Array.from({ length: argumentCount }, (_, index) =>
          this.actualsList.expressions[index]?.toQuads(context)
        ),
        this.id.getName()
      ),
    ];
  }

  toQuads(context: QuadsContext) {
    return [
      ...this.toPartialQuads(context),
      new GetRetQuad(context.requestTemp()),
    ];
  }
}
