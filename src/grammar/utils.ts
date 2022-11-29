import type { Tokens } from '../tokenize/tokens.js';
import type { IR, RA, RR } from '../utils/types.js';
import { AstNode } from '../ast/definitions/AstNode.js';

/**
 * PureGrammar does not contain the function for converting the parse tree node
 * to abstract syntax tree node. It only contains the tokens/productions
 */
export type PureGrammar<T extends string> = RR<T, RA<PureGrammarLine<T>>>;

/**
 * AbstractGrammar is a grammar that also contains a function for converting
 * the parse tree to abstract syntax tree
 */
export type AbstractGrammar<T extends string> = RR<
  T,
  RA<AbstractGrammarLine<T>>
>;

export type PureGrammarLine<T extends string> = RA<T | keyof Tokens>;

export type AbstractGrammarLine<T extends string> = RA<
  T | keyof Tokens | ((nodes: IR<AstNode>) => AstNode)
>;

export const epsilon = ['__'] as const;

export const toPureGrammar = <T extends string>(
  grammar: AbstractGrammar<T>
): PureGrammar<T> =>
  Object.fromEntries(
    Object.entries(grammar).map(
      ([name, lines]) =>
        [
          name,
          lines.map((line) =>
            line.filter(
              (part): part is T | keyof Tokens => typeof part === 'string'
            )
          ),
        ] as const
    )
  );
