import type { EvalContext } from '../../../eval.js';
import type { NameAnalysisContext } from '../../../nameAnalysis.js';
import { createScope } from '../../../nameAnalysis.js';
import type { TypeCheckContext } from '../../../typing.js';
import { assertType, cascadeError } from '../../../typing.js';
import type { PrintContext } from '../../../unparse.js';
import { indent } from '../../../unparse.js';
import type { Expression } from '../../expression/index.js';
import type { TokenNode } from '../../TokenNode.js';
import { token } from '../../TokenNode.js';
import type { StatementList } from '../StatementList.js';
import { BlockStatement } from './index.js';
import { QuadsContext } from '../../../../quads/index.js';
import { Quad } from '../../../../quads/definitions/index.js';
import { RA } from '../../../../utils/types.js';
import { IfQuad } from '../../../../quads/definitions/IfQuad.js';

export class IfNode extends BlockStatement {
  public constructor(
    private readonly token: TokenNode,
    public readonly condition: Expression,
    public readonly statements: StatementList,
    public readonly elseStatements: StatementList | undefined
  ) {
    super([
      condition,
      statements,
      ...(elseStatements === undefined ? [] : [elseStatements]),
    ]);
  }

  public nameAnalysis(context: NameAnalysisContext) {
    this.nameAnalysisContext = context;
    this.condition.nameAnalysis(context);
    const newScope = {
      ...context,
      symbolTable: [...context.symbolTable, createScope(this)],
    };
    this.statements.nameAnalysis(newScope);
    if (typeof this.elseStatements === 'object') {
      const newScope = {
        ...context,
        symbolTable: [...context.symbolTable, createScope(this)],
      };
      this.elseStatements.nameAnalysis(newScope);
    }
  }

  public typeCheck(context: TypeCheckContext) {
    return cascadeError(
      assertType(context, this.condition, 'nonBoolIf', 'bool'),
      this.statements.typeCheck(context),
      this.elseStatements?.typeCheck(context)
    );
  }

  public pretty(printContext: PrintContext) {
    return [
      token('IF'),
      ' ',
      token('LPAREN'),
      this.condition.print(printContext),
      token('RPAREN'),
      indent(printContext, this.statements),
      ...(this.elseStatements === undefined
        ? []
        : [' ', token('ELSE'), ' ', indent(printContext, this.elseStatements)]),
    ];
  }

  public getToken() {
    return this.token;
  }

  public async evaluate(context: EvalContext) {
    const condition = await this.condition.evaluate(context);
    return Boolean(condition)
      ? this.statements.evaluate(context)
      : this.elseStatements?.evaluate(context);
  }

  public toQuads(context: QuadsContext): RA<Quad> {
    return [
      new IfQuad(
        this.condition.toQuads(context),
        this.statements.toQuads(context),
        typeof this.elseStatements === 'object'
          ? {
              quads: this.elseStatements.toQuads(context),
              label: context.requestLabel(),
            }
          : undefined,
        context
      ),
    ];
  }
}
