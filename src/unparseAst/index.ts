import type { GrammarKey } from '../cykParser/contextFreeGrammar.js';
import type { ParseTreeNode } from '../slrParser/index.js';
import { simpleTokens } from '../tokenize/definitions.js';
import type { Tokens } from '../tokenize/tokens.js';
import type { Token } from '../tokenize/types.js';
import type { RR } from '../utils/types.js';

export const unparseAst = <
  TERMINALS extends keyof Tokens,
  NON_TERMINALS extends string
>(
  parseTree: ParseTreeNode<TERMINALS, NON_TERMINALS>
): string => recursiveUnparse(parseTree, 0).trim();

const indentation = '    ';

export function recursiveUnparse<
  TERMINALS extends keyof Tokens,
  NON_TERMINALS extends string
>(parseTree: ParseTreeNode<TERMINALS, NON_TERMINALS>, indent: number): string {
  if ('type' in parseTree) {
    const pre = separatorOverwrites[parseTree.type]?.pre ?? defaultPreSeparator;
    const post =
      separatorOverwrites[parseTree.type]?.post ?? defaultPostSeparator;
    const indentString = post.endsWith('\n') ? indentation.repeat(indent) : '';
    return `${pre}${tokenPrinter(parseTree)}${post}${indentString}`;
  } else {
    let localIndent = indent;
    const formatted = parseTree.children
      .map((token, index) => {
        const indentChange =
          'type' in token ? indentChangers[token.type] ?? 0 : 0;
        if (indentChange === 1) localIndent += 1;
        if (indentChange === -1) localIndent -= 1;
        const formattedToken = recursiveUnparse(token, localIndent);
        const nextToken = parseTree.children[index + 1];
        // Convert `return ;` into `return;`
        return typeof nextToken === 'object' &&
          'type' in nextToken &&
          nextToken.type === 'SEMICOL'
          ? formattedToken.trimEnd()
          : formattedToken;
      })
      .join('');
    return `${formatted}${newLineTerminals.has(parseTree.token) ? '\n' : ''}`;
  }
}

/** Define separators for all tokens */
const defaultPreSeparator = ' ';
const defaultPostSeparator = '';
const separatorOverwrites: Partial<
  RR<
    keyof Tokens,
    {
      readonly pre?: string;
      readonly post?: string;
    }
  >
> = {
  COMMA: { pre: '' },
  LCURLY: { post: '\n' },
  LPAREN: { post: '' },
  NOT: { post: '' },
  POSTDEC: { pre: '' },
  POSTINC: { pre: '' },
  RCURLY: { post: '\n' },
  RPAREN: { post: '' },
  SEMICOL: { pre: '', post: '\n' },
};

const indentChangers: Partial<RR<keyof Tokens, number>> = {
  LCURLY: 1,
  RCURLY: -1,
};

/** Add two new lines after these statements */
const newLineTerminals: ReadonlySet<GrammarKey> = new Set([
  'fnDecl',
  'blockStmt',
]);

const indexedSimpleTokens = Object.fromEntries(simpleTokens);

/** Resolve a token into a string */
function tokenPrinter<TERMINALS extends keyof Tokens>(
  token: Token<TERMINALS>
): string {
  if (token.type === 'END') return '';
  else if (
    token.type === 'ID' ||
    token.type === 'INTLITERAL' ||
    token.type === 'STRINGLITERAL'
  )
    return (token.data as Tokens['ID']).literal.toString();
  else return indexedSimpleTokens[token.type];
}
