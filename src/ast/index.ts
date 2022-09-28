/**
 * The unparser can do a reasonably good job just from the parse tree, thus
 * conversion to AST was no necessary. However, AST would be necessary for
 * semantic analysis, and thus this file would be augmented then.
 */

import type { GrammarKey } from '../cykParser/contextFreeGrammar.js';
import type { ParseTreeNode } from '../slrParser/index.js';
import { simpleTokens } from '../tokenize/definitions.js';
import type { Tokens } from '../tokenize/tokens.js';
import type { Token } from '../tokenize/types.js';
import type { RA, RR } from '../utils/types.js';

export function parseTreeToAst(
  parseTree: ParseTreeNode<keyof Tokens, GrammarKey>
): AstNode {
  if ('type' in parseTree || parseTree.token !== 'program')
    throw new Error('Invalid parse tree');
  else return new translators.program(parseTree.children);
}

/* eslint-disable functional/no-class */

/* eslint-disable functional/no-this-expression */
abstract class AstNode {
  protected readonly children: RA<AstNode>;

  public constructor(children: RA<ParseTreeNode<keyof Tokens, GrammarKey>>) {
    this.children = children.map((part) =>
      'type' in part
        ? new TokenNode(part)
        : new translators[part.token](part.children)
    );
  }

  public pretty(): string {
    return this.children.map((part) => part.pretty()).join('');
  }
}

const indexedSimpleTokens = Object.fromEntries(simpleTokens);

class TokenNode extends AstNode {
  public constructor(public readonly token: Token) {
    super([]);
  }

  public pretty(): string {
    if (this.token.type === 'END') return '';
    else if (
      this.token.type === 'ID' ||
      this.token.type === 'INTLITERAL' ||
      this.token.type === 'STRINGLITERAL'
    )
      return (this.token.data as Tokens['ID']).literal.toString();
    else return indexedSimpleTokens[this.token.type];
  }
}

// TODO: define reminding nodes
// @ts-expect-error Not all nodes are defined yet
const translators: RR<
  GrammarKey,
  new (...props: ConstructorParameters<typeof AstNode>) => AstNode
> = {
  program: class extends AstNode {},
  globals: class extends AstNode {
    public pretty(): string {
      if (this.children.at(-1)?.pretty() === ';')
        return this.children.map((part) => part.pretty()).join('');
      return super.pretty();
    }
  },
};
/* eslint-enable functional/no-class */
/* eslint-enable functional/no-this-expression */
