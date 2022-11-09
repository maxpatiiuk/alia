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
import type { Statement } from '../index.js';
import { StatementList } from '../StatementList.js';
import { BlockStatement } from './index.js';

export class ForNode extends BlockStatement {
  public constructor(
    private readonly token: TokenNode,
    public readonly declaration: Statement,
    public readonly condition: Expression,
    public readonly action: Statement,
    public readonly statements: StatementList
  ) {
    super([declaration, condition, action, statements]);
  }

  public nameAnalysis(context: NameAnalysisContext) {
    this.nameAnalysisContext = context;
    const newScope = {
      ...context,
      symbolTable: [...context.symbolTable, createScope(this)],
    };
    this.declaration.nameAnalysis(newScope);
    this.condition.nameAnalysis(newScope);
    const fullStatements = new StatementList([
      ...this.statements.children,
      this.action,
    ]);
    fullStatements.nameAnalysis(newScope);
  }

  public typeCheck(context: TypeCheckContext) {
    return cascadeError(
      this.declaration.typeCheck(context),
      assertType(context, this.condition, 'nonBoolLoop', 'bool'),
      this.action.typeCheck(context),
      this.statements.typeCheck(context)
    );
  }

  public pretty(printContext: PrintContext) {
    return [
      token('FOR'),
      ' ',
      token('LPAREN'),
      this.declaration.print(printContext),
      token('SEMICOL'),
      ' ',
      this.condition.print(printContext),
      token('SEMICOL'),
      ' ',
      this.action.print(printContext),
      token('RPAREN'),
      indent(printContext, this.statements),
    ];
  }

  public getToken() {
    return this.token;
  }

  public async evaluate(context: EvalContext) {
    await this.declaration.evaluate(context);
    while (await this.condition.evaluate(context)) {
      const result = await this.statements.evaluate(context);
      await this.action.evaluate(context);
      this.statements.children.forEach(resetValues);
      this.action.children.forEach(resetValues);
      if (result instanceof ReturnValue) return result;
    }
    return undefined;
  }
}
