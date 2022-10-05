import type {AstNode} from '../ast/index.js';
import type {Tokens} from '../tokenize/tokens.js';
import type {RA, RR} from '../utils/types.js';

export type PureGrammar<T extends string> = RR<T,
  RA<PureGrammarLine<T>>>;

export type AbstractGrammar<T extends string> = RR<T,
  RA<AbstractGrammarLine<T>>>;

export type PureGrammarLine<T extends string> = RA<T | keyof Tokens>;

export type AbstractGrammarLine<T extends string> = RA<T | keyof Tokens | (() => AstNode)>;

export const epsilon = ['__'] as const;

export const toPureGrammar = <T extends string>(grammar: AbstractGrammar<T>): PureGrammar<T> =>
  Object.fromEntries(Object.entries(grammar)
    .map(([name, lines]) => [name,
      lines.map((line) => line.filter((part): part is (T | keyof Tokens) => typeof part !== 'string'))
    ] as const)
  )
