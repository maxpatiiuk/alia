import { filterArray } from '../../../../utils/types.js';
import type { EvalContext } from '../../../eval.js';
import { ReturnValue } from '../../../eval.js';
import type { QuadsContext } from '../../../quads/index.js';
import type { LanguageType, TypeCheckContext } from '../../../typing.js';
import { ErrorType, VoidType } from '../../../typing.js';
import type { PrintContext } from '../../../unparse.js';
import type { Expression } from '../../expression/index.js';
import { FunctionDeclaration } from '../../FunctionDeclaration.js';
import type { TokenNode } from '../../TokenNode.js';
import { token } from '../../TokenNode.js';
import { LineStatement } from './index.js';
import { SimpleQuad } from '../../../quads/definitions/SimpleQuad.js';

export class ReturnNode extends LineStatement {
  public constructor(
    private readonly token: TokenNode,
    public readonly expression: Expression | undefined
  ) {
    super(expression === undefined ? [] : [expression]);
  }

  public typeCheck(context: TypeCheckContext): LanguageType {
    const functionDecl = Array.from(this.nameAnalysisContext.symbolTable)
      .reverse()
      .find(({ node }) => node instanceof FunctionDeclaration)?.node;
    if (!(functionDecl instanceof FunctionDeclaration)) return VoidType;
    const actualReturnType = this.expression?.typeCheck(context);
    if (actualReturnType instanceof ErrorType) return actualReturnType;
    const returnType = functionDecl.returnType;
    if (actualReturnType === undefined) {
      return returnType instanceof VoidType
        ? returnType
        : context.reportError(this, 'noReturn');
    } else if (
      actualReturnType.toString() === returnType.toString() &&
      !(returnType instanceof VoidType)
    )
      return actualReturnType;
    else
      return context.reportError(
        this.expression ?? this,
        returnType instanceof VoidType ? 'voidReturn' : 'wrongReturn'
      );
  }

  public pretty(printContext: PrintContext) {
    return [
      token('RETURN'),
      ...(this.expression ? [' ', this.expression.print(printContext)] : []),
    ];
  }

  public getToken() {
    return this.token;
  }

  public async evaluate(context: EvalContext) {
    const value = await this.expression?.evaluate(context);
    if (value instanceof ReturnValue)
      throw new Error('Unexpected return value');
    context.onReturnCalled(value);
    return new ReturnValue(value);
  }

  public toQuads(context: QuadsContext) {
    const quads = this.expression?.toQuads(context);
    return filterArray([
      ...(quads ?? []),
      typeof quads === 'object'
        ? new SimpleQuad('setret', quads.at(-1)!.toValue())
        : undefined,
      new SimpleQuad('goto', context.returnLabel),
    ]);
  }
}
