import { RA } from '../utils/types.js';
import { AstNode } from './definitions/AstNode.js';
import { VariableDeclaration } from './definitions/statement/VariableDeclaration.js';
import { GlobalsNode } from './definitions/GlobalsNode.js';
import { IdNode } from './definitions/term/IdNode.js';
import { FunctionDeclaration } from './definitions/FunctionDeclaration.js';
import { WhileNode } from './definitions/statement/block/WhileNode.js';
import { ForNode } from './definitions/statement/block/ForNode.js';
import { IfNode } from './definitions/statement/block/IfNode.js';

export type Scope = {
  readonly items: RA<FunctionDeclaration | VariableDeclaration>;
  readonly node:
    | ForNode
    | FunctionDeclaration
    | GlobalsNode
    | IfNode
    | WhileNode;
  readonly addItem: (
    item: FunctionDeclaration | VariableDeclaration,
    dry?: boolean
  ) => void;
};
export type NameAnalysisContext = {
  readonly symbolTable: RA<Scope>;
  // If IdNode is used inside a declaration, supress undefined identifier errors
  readonly isDeclaration: boolean;
  readonly reportError: (idNode: IdNode, message: string) => void;
};

export function getScope(node: AstNode) {
  const currentScope = node.nameAnalysisContext.symbolTable.at(-1);
  if (currentScope === undefined)
    throw new Error('Trying to declare a function outside of scope');
  else return currentScope;
}

export const findDeclaration = (
  name: string,
  context: NameAnalysisContext
): FunctionDeclaration | VariableDeclaration | undefined =>
  Array.from(context.symbolTable)
    .reverse()
    .flatMap(({ items }) => items)
    .find((item) => item.id.getName() === name);

/**
 * Call this to receive a new scope that can be added to the SymbolTable.
 */
export const createScope = (
  node: ForNode | FunctionDeclaration | GlobalsNode | IfNode | WhileNode
): Scope => ({
  items: node.declarations,
  node,
  addItem: (item, dry) => {
    const itemName = item.id.getName();
    const duplicateIdentifier = node.declarations.find(
      (declaration) => declaration.id.getName() === itemName
    );
    if (typeof duplicateIdentifier === 'object')
      node.nameAnalysisContext.reportError(
        item.id,
        'Multiply declared identifier'
      );
    else if (dry !== true) node.declarations.push(item);
  },
});
