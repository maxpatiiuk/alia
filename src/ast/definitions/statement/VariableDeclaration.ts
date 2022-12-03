import type llvm from 'llvm-bindings';

import { TempVariable } from '../../../quads/definitions/IdQuad.js';
import type { Quad } from '../../../quads/definitions/index.js';
import { VarDeclQuad } from '../../../quads/definitions/VarDeclQuad.js';
import type { QuadsContext } from '../../../quads/index.js';
import type { RA } from '../../../utils/types.js';
import type { EvalContext, EvalValue } from '../../eval.js';
import type { NameAnalysisContext } from '../../nameAnalysis.js';
import { getScope } from '../../nameAnalysis.js';
import type { LanguageType, TypeCheckContext } from '../../typing.js';
import { BoolType, IntType, StringType, VoidType } from '../../typing.js';
import type { PrintContext } from '../../unparse.js';
import { FunctionDeclaration } from '../FunctionDeclaration.js';
import type { IdNode } from '../term/IdNode.js';
import type { TypeNode } from '../types/index.js';
import { PrimaryTypeNode } from '../types/PrimaryTypeNode.js';
import { Statement } from './index.js';

export class VariableDeclaration extends Statement {
  // eslint-disable-next-line functional/prefer-readonly-type
  public value: EvalValue;

  // eslint-disable-next-line functional/prefer-readonly-type
  public llvmValue: llvm.Value = undefined!;

  // eslint-disable-next-line functional/prefer-readonly-type
  public tempVariable: TempVariable = new TempVariable(-1);

  public constructor(
    public readonly type: TypeNode,
    public readonly id: IdNode
  ) {
    super([type, id]);
  }

  public nameAnalysis(context: NameAnalysisContext) {
    super.nameAnalysis({ ...context, isDeclaration: true });
    if (
      this.type instanceof PrimaryTypeNode &&
      this.type.token.token.type === 'VOID'
    ) {
      this.nameAnalysisContext.reportError(
        this.id,
        'Invalid type in declaration'
      );
      getScope(this).addItem(this, true);
    } else getScope(this).addItem(this);
  }

  public getToken() {
    return this.id.getToken();
  }

  public pretty(printContext: PrintContext) {
    return [this.type.print(printContext), ' ', this.id.print(printContext)];
  }

  public printType(printContext: PrintContext) {
    return this.id.printType(printContext);
  }

  public typeCheck(context: TypeCheckContext): LanguageType {
    const type = this.id.typeCheck(context);
    if (type instanceof IntType) this.value = 0;
    else if (type instanceof BoolType) this.value = false;
    else if (type instanceof StringType) this.value = '';
    return new VoidType();
  }

  public async evaluate(_context: EvalContext) {
    return this.value;
  }

  public toQuads(context: QuadsContext): RA<Quad> {
    const name = this.id.getName();
    this.tempVariable = context.declareVar(name);
    return typeof this.tempVariable.variable === 'number'
      ? [new VarDeclQuad(name, this.type, this.tempVariable, this)]
      : [];
  }
}

export function toPrimitiveValue(value: EvalValue): number {
  if (typeof value === 'number') return value;
  else if (typeof value === 'boolean') return value ? 1 : 0;
  else if (typeof value === 'string') {
    throw new TypeError('String variables are not supported');
  } else if (value instanceof FunctionDeclaration)
    throw new Error('Cannot convert function to primitive value');
  // Happens for undefined pointers
  else return 0;
}
