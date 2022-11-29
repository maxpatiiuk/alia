/**
 * Reformat the code based on the parse tree alone (withouth the AST)
 */

import type { GrammarKey } from '../grammar/index.js';
import type { ParseTreeNode } from '../slrParser/index.js';
import { simpleTokens } from '../tokenize/definitions.js';
import type { Tokens } from '../tokenize/tokens.js';
import type { Token } from '../tokenize/types.js';
import type { RR } from '../utils/types.js';

const reStartingSpace = /^(?: {4})*(?<trim> )?/g;

export const unparseParseTree = <
  TERMINALS extends keyof Tokens,
  NON_TERMINALS extends string
>(
  parseTree: ParseTreeNode<TERMINALS, NON_TERMINALS>
): string =>
  recursiveUnparse(parseTree, 0)
    .trim()
    .split('\n')
    .map((line) =>
      line.replaceAll(reStartingSpace, (match) => match.slice(0, -1))
    )
    .map((line) => (line.trim() === '' ? '' : line))
    .join('\n');

export const indentation = '    ';

export function recursiveUnparse<
  TERMINALS extends keyof Tokens,
  NON_TERMINALS extends string
>(parseTree: ParseTreeNode<TERMINALS, NON_TERMINALS>, indent: number): string {
  if ('type' in parseTree) {
    const pre = separatorOverwrites[parseTree.type]?.pre ?? ' ';
    const post = separatorOverwrites[parseTree.type]?.post ?? '';
    return `${pre}${tokenPrinter(parseTree)}${post}`;
  } else {
    let localIndent = indent;
    let result = '';
    let post: string | undefined = undefined;
    parseTree.children.forEach((token) => {
      const indentChange =
        'type' in token ? indentChangers[token.type] ?? 0 : 0;
      localIndent += indentChange;
      let formattedToken = recursiveUnparse(token, localIndent);
      if (post === '' && formattedToken[0] === ' ')
        formattedToken = formattedToken.slice(1);
      post =
        'type' in token ? separatorOverwrites[token.type]?.post : undefined;
      const indentString = formattedToken.endsWith('\n')
        ? indentation.repeat(localIndent)
        : '';
      if (indentChange === -1) result = result.slice(0, -indentation.length);
      result += `${formattedToken}${indentString}`;
    });
    const separators =
      separatorOverwrites[parseTree.closure.nonTerminal as GrammarKey];
    return `${separators?.pre ?? ''}${result}${separators?.post ?? ''}`;
  }
}

/** Define separator overwrites for tokens or grammar keys */
export const separatorOverwrites: Partial<
  RR<
    keyof Tokens | GrammarKey,
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
  RPAREN: { pre: '' },
  SEMICOL: { pre: '' },
  stmtList: { post: '\n' },
  globals: { post: '\n' },
};

const indentChangers: Partial<RR<keyof Tokens, number>> = {
  LCURLY: 1,
  RCURLY: -1,
};

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
