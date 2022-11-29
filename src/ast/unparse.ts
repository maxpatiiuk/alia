/**
 * Helper functions for pretty printing the source code based on the AST
 */

import { AstNode } from './definitions/AstNode.js';
import { token } from './definitions/TokenNode.js';
import { indentation } from '../unparseParseTree/index.js';
import { RA } from '../utils/types.js';

export type PrintContext = {
  readonly indent: number;
  readonly mode: 'nameAnalysis' | 'pretty';
  readonly debug: boolean;
  // Whether expression needs to be wrapped in parentheses just to be safe
  readonly needWrapping: boolean;
};

export function indent(printContext: PrintContext, node: AstNode): string {
  const newContext = { ...printContext, indent: printContext.indent + 1 };
  const content = node.print(newContext);
  return [
    token('LCURLY'),
    '\n',
    content,
    content.length === 0 ? '' : '\n',
    indentation.repeat(printContext.indent),
    token('RCURLY'),
  ].join('');
}

export const wrapChild = (printContext: PrintContext, node: AstNode) =>
  node.print({ ...printContext, needWrapping: true });
export const wrap = (
  printContext: PrintContext,
  output: RA<string>
): RA<string> | string =>
  printContext.needWrapping
    ? [token('LPAREN'), ...output, token('RPAREN')]
    : output;
