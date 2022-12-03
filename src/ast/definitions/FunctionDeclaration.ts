import type { RA } from '../../utils/types.js';
import type { EvalContext, EvalValue } from '../eval.js';
import { resetValues, ReturnValue } from '../eval.js';
import type { NameAnalysisContext } from '../nameAnalysis.js';
import { createScope, getScope } from '../nameAnalysis.js';
import type { LanguageType, TypeCheckContext } from '../typing.js';
import { cascadeError, ErrorType, FunctionType } from '../typing.js';
import type { PrintContext } from '../unparse.js';
import { indent } from '../unparse.js';
import { AstNode } from './AstNode.js';
import type { FormalsDeclNode } from './FormalsDeclNode.js';
import type { StatementList } from './statement/StatementList.js';
import type { IdNode } from './term/IdNode.js';
import { token } from './TokenNode.js';
import { FunctionTypeNode } from './types/FunctionTypeNode.js';
import type { TypeNode } from './types/index.js';
import { TypeListNode } from './types/TypeListNode.js';
import { Quad } from '../../quads/definitions/index.js';
import { QuadsContext } from '../../quads/index.js';
import { FunctionQuad } from '../../quads/definitions/FunctionQuad.js';

export class FunctionDeclaration extends AstNode {
  public readonly typeNode: FunctionType;

  // eslint-disable-next-line functional/prefer-readonly-type
  public returnType: LanguageType;

  public constructor(
    public readonly type: TypeNode,
    public readonly id: IdNode,
    public readonly formals: FormalsDeclNode,
    private readonly statements: StatementList
  ) {
    super([type, id, formals, statements]);
    this.typeNode = new FunctionType(
      new FunctionTypeNode(
        new TypeListNode(this.formals.children.map(({ type }) => type)),
        this.type
      )
    );
    this.returnType = new ErrorType();
  }

  public nameAnalysis(context: NameAnalysisContext) {
    this.nameAnalysisContext = context;
    getScope(this).addItem(this);
    this.type.nameAnalysis(context);
    this.id.nameAnalysis({ ...context, isDeclaration: true });
    const newScope = {
      ...context,
      symbolTable: [...context.symbolTable, createScope(this)],
    };
    this.formals.nameAnalysis(newScope);
    this.statements.nameAnalysis(newScope);
  }

  public typeCheck(context: TypeCheckContext) {
    this.returnType = this.type.typeCheck(context);
    const cascadeType = cascadeError(
      this.returnType,
      this.id.typeCheck(context),
      this.formals.typeCheck(context),
      this.statements.typeCheck(context)
    );
    return cascadeType instanceof Error ? cascadeType : this.typeNode;
  }

  public pretty(printContext: PrintContext) {
    return [
      this.type.print(printContext),
      ' ',
      this.id.print({ ...printContext, mode: 'pretty' }),
      printContext.mode === 'nameAnalysis' ? this.printType(printContext) : '',
      token('LPAREN'),
      this.formals.print(printContext),
      token('RPAREN'),
      indent(printContext, this.statements),
    ];
  }

  public getToken() {
    return this.id.getToken();
  }

  public printType(printContext: PrintContext): string {
    return [
      token('LPAREN'),
      this.formals.printType(printContext),
      token('ARROW'),
      this.type.printType(printContext),
      token('RPAREN'),
    ].join('');
  }

  public toString(): string {
    return this.printType({
      indent: 0,
      mode: 'nameAnalysis',
      debug: false,
      needWrapping: false,
    });
  }

  public async evaluate(_context: EvalContext) {
    return this;
  }

  public async call(context: EvalContext, actuals: RA<EvalValue>) {
    this.formals.children.forEach((formal, index) => {
      formal.value = actuals[index];
    });

    const result = await this.statements.evaluate(context);
    resetValues(this.formals);
    resetValues(this.statements);

    return result instanceof ReturnValue ? result.value : result;
  }

  public toQuads(context: QuadsContext): RA<Quad> {
    return [
      new FunctionQuad(
        this.typeNode.type,
        this.id.getName(),
        this.formals,
        this.statements,
        context
      ),
    ];
  }
}
