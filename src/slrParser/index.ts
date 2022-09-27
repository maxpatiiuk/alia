import { getGrammarRoot } from '../cykParser/chomsky/uselessRules.js';
import type { AbstractGrammar } from '../cykParser/contextFreeGrammar.js';
import type { Tokens } from '../tokenize/tokens.js';
import type { Token } from '../tokenize/types.js';
import type { RA, WritableArray } from '../utils/types.js';
import { getTable } from './buildTable.js';

type StackItem<TERMINALS extends keyof Tokens, NON_TERMINALS extends string> = {
  readonly state: number;
  readonly item: Tree<TERMINALS, NON_TERMINALS>;
};

type Tree<TERMINALS extends keyof Tokens, NON_TERMINALS extends string> =
  | Token<TERMINALS>
  | {
      readonly token: NON_TERMINALS;
      readonly children: RA<Tree<TERMINALS, NON_TERMINALS>>;
    };

export function slrParser<
  TERMINALS extends keyof Tokens,
  NON_TERMINALS extends string
>(
  grammar: AbstractGrammar<NON_TERMINALS>,
  tokens: RA<Token<TERMINALS>>
): Token<TERMINALS> | Tree<TERMINALS, NON_TERMINALS> {
  const table = getTable(grammar);
  let stack: WritableArray<StackItem<TERMINALS, NON_TERMINALS>> = [
    {
      state: 0,
      item: tokens[0],
    },
  ];
  let tokenIndex = 0;

  while (true) {
    const state = stack.at(-1)!;
    const lookahead = tokens[tokenIndex]?.type;
    const cell = table[state.state][lookahead ?? ''];
    if (cell === undefined)
      throw new Error(
        `Unexpected token ${lookahead} at position ${tokenIndex + 1}/${
          tokens.length
        }`
      );
    else if (cell.type === 'Move') {
      stack.push({
        state: cell.to,
        item: tokens[tokenIndex],
      });
      tokenIndex += 1;
    } else if (cell.type === 'Accept')
      return {
        token: getGrammarRoot(grammar),
        children: stack.slice(1).map(({ item }) => item),
      };
    else if (cell.type === 'Reduce') {
      const rule = grammar[cell.to.nonTerminal][cell.to.index];
      const tree: Tree<TERMINALS, NON_TERMINALS> = {
        token: cell.to.nonTerminal,
        children: stack.slice(-1 * rule.length).map(({ item }) => item),
      };
      stack = stack.slice(0, -1 * rule.length);

      const state = stack.at(-1)!;
      const nextCell = table[state.state][cell.to.nonTerminal];
      if (nextCell?.type !== 'Move')
        throw new Error(`Unexpected non-move cell in ${cell.to.nonTerminal}`);

      stack.push({
        state: nextCell.to,
        item: tree,
      });
    }
  }
}
