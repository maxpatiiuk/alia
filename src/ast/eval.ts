import type { RA } from '../utils/types.js';
import { handleInput } from '../frontEnd.js';
import { Expression } from './definitions/expression/index.js';
import { FunctionDeclaration } from './definitions/FunctionDeclaration.js';
import { AstNode } from './definitions/AstNode.js';
import { VariableDeclaration } from './definitions/statement/VariableDeclaration.js';
import { StatementList } from './definitions/statement/StatementList.js';

export type EvalContext = {
  readonly output: (message: string) => void;
  readonly input: ReturnType<typeof handleInput>;
  readonly onReturnCalled: (value: EvalValue) => void;
};

export type EvalValue =
  | FunctionDeclaration
  | boolean
  | number
  | string
  | undefined;

export class ReturnValue {
  public constructor(public readonly value: EvalValue) {}
}

export type EvalReturnValue = EvalValue | ReturnValue;

export async function evalList(
  context: EvalContext,
  list: RA<Expression | StatementList>
): Promise<EvalReturnValue> {
  let value: EvalReturnValue = undefined;
  for (const child of list) {
    value = await child.evaluate(context);
    if (value instanceof ReturnValue) return value;
  }
  return value;
}

export function resetValues(statement: AstNode) {
  if (statement instanceof VariableDeclaration)
    statement.typeCheck({
      reportError: () => {
        throw new Error('reportError is not implemented');
      },
    });
  else statement.children.forEach(resetValues);
}
