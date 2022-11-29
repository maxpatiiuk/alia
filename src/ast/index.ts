/**
 * Convert parse tree to an AST.
 *
 * AST can then be used for name analysis, type analysis and intermediate
 * code generation.
 */

import type { GrammarKey } from '../grammar/index.js';
import type { AbstractGrammar } from '../grammar/utils.js';
import { epsilon } from '../grammar/utils.js';
import type { ParseTreeLevel, ParseTreeNode } from '../slrParser/index.js';
import type { Tokens } from '../tokenize/tokens.js';
import type { IR, R, RA, WritableArray } from '../utils/types.js';
import { getUniqueName } from '../utils/uniquifyName.js';
import { AstNode } from './definitions/AstNode.js';
import { TokenNode } from './definitions/TokenNode.js';

export function parseTreeToAst(
  nullFreeGrammar: AbstractGrammar<GrammarKey>,
  parseTree: ParseTreeNode<keyof Tokens, GrammarKey>
): AstNode {
  if ('type' in parseTree || parseTree.closure.nonTerminal !== 'program')
    throw new Error('Invalid parse tree');
  else return toAst(nullFreeGrammar, parseTree);
}

function toAst(
  grammar: AbstractGrammar<GrammarKey>,
  { closure, children }: ParseTreeLevel<keyof Tokens, GrammarKey>
): AstNode {
  if (closure.nonTerminal === epsilon[0])
    throw new Error('Received unprocessed grammar');
  const builder = grammar[closure.nonTerminal][closure.index].at(-1);
  const parts = grammar[closure.nonTerminal][closure.index]
    .slice(0, -1)
    .filter((part): part is string => typeof part === 'string');
  if (typeof builder !== 'function')
    throw new Error('Received invalid grammar');
  return builder(
    indexParts(
      parts,
      children.map((child) =>
        'type' in child ? new TokenNode(child) : toAst(grammar, child)
      )
    )
  );
}

function indexParts(keys: RA<string>, partValues: RA<AstNode>): IR<AstNode> {
  const usedNames: WritableArray<string> = [];
  return keys.reduce<R<AstNode>>((result, key, index) => {
    const uniqueKey = getUniqueName(key, usedNames);
    usedNames.push(uniqueKey);
    result[uniqueKey] ??= partValues[index];
    return result;
  }, {});
}

export const exportsForTests = {
  indexParts,
};
