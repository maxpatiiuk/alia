import type { EvalContext } from '../../../eval.js';
import { resetValues, ReturnValue } from '../../../eval.js';
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
import { Quad } from '../../../quads/definitions.js';
import { QuadsContext } from '../../../quads/index.js';
import { RA } from '../../../../utils/types.js';

export class WhileNode extends BlockStatement {
  public constructor(
    private readonly token: TokenNode,
    public readonly condition: Expression,
    public readonly statements: StatementList
  ) {
    super([condition, statements]);
  }

  public nameAnalysis(context: NameAnalysisContext) {
    this.nameAnalysisContext = context;
    this.condition.nameAnalysis(context);
    const newScope = {
      ...context,
      symbolTable: [...context.symbolTable, createScope(this)],
    };
    this.statements.nameAnalysis(newScope);
  }

  public typeCheck(context: TypeCheckContext) {
    return cascadeError(
      assertType(context, this.condition, 'nonBoolLoop', 'bool'),
      this.statements.typeCheck(context)
    );
  }

  public pretty(printContext: PrintContext) {
    return [
      token('WHILE'),
      ' ',
      token('LPAREN'),
      this.condition.print(printContext),
      token('RPAREN'),
      indent(printContext, this.statements),
    ];
  }

  public getToken() {
    return this.token;
  }

  public async evaluate(context: EvalContext) {
    while (await this.condition.evaluate(context)) {
      const result = await this.statements.evaluate(context);
      this.statements.children.forEach(resetValues);
      if (result instanceof ReturnValue) return result;
    }
    return undefined;
  }

  // FIXME: implement toQuads
  public toQuads(_context: QuadsContext): RA<Quad> {
    return [];
  }
}
