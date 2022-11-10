import type { RA } from '../../../utils/types.js';
import type { EvalContext, EvalValue } from '../../eval.js';
import type { NameAnalysisContext } from '../../nameAnalysis.js';
import { getScope } from '../../nameAnalysis.js';
import type { Quad } from '../../quads/definitions.js';
import type { LanguageType, TypeCheckContext } from '../../typing.js';
import { BoolType, IntType, StringType, VoidType } from '../../typing.js';
import type { PrintContext } from '../../unparse.js';
import type { IdNode } from '../term/IdNode.js';
import type { TypeNode } from '../types/index.js';
import { PrimaryTypeNode } from '../types/PrimaryTypeNode.js';
import { Statement } from './index.js';

export class VariableDeclaration extends Statement {
  // eslint-disable-next-line functional/prefer-readonly-type
  public value: EvalValue;

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

  public toQuads(): RA<Quad> {
    return [];
  }
}
