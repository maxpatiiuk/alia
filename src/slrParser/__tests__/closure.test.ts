import type { AbstractGrammar } from '../../cykParser/contextFreeGrammar.js';
import { theories } from '../../tests/utils.js';
import type { Tokens } from '../../tokenize/tokens.js';
import { getClosureStates, reduceClosure } from '../closure.js';

const abstractGrammar: AbstractGrammar<'L' | 'P' | 'S'> = {
  S: [['P']],
  P: [['(' as keyof Tokens, 'L', ')' as keyof Tokens]],
  L: [['id' as keyof Tokens], ['L', 'id' as keyof Tokens]],
};

theories(getClosureStates, [
  {
    in: [abstractGrammar, { nonTerminal: 'S', index: 0, position: 0 }],
    out: [
      {
        index: 0,
        nonTerminal: 'S',
        position: 0,
      },
      {
        index: 0,
        nonTerminal: 'P',
        position: 0,
      },
    ],
  },
  {
    in: [abstractGrammar, { nonTerminal: 'P', index: 0, position: 0 }],
    out: [
      {
        index: 0,
        nonTerminal: 'P',
        position: 0,
      },
    ],
  },
  {
    in: [abstractGrammar, { nonTerminal: 'L', index: 1, position: 0 }],
    out: [
      {
        index: 1,
        nonTerminal: 'L',
        position: 0,
      },
      {
        index: 0,
        nonTerminal: 'L',
        position: 0,
      },
    ],
  },
  {
    in: [abstractGrammar, { nonTerminal: 'P', index: 0, position: 1 }],
    out: [
      {
        index: 0,
        nonTerminal: 'P',
        position: 1,
      },
      {
        index: 0,
        nonTerminal: 'L',
        position: 0,
      },
      {
        index: 1,
        nonTerminal: 'L',
        position: 0,
      },
    ],
  },
]);

theories(reduceClosure, [
  {
    in: [
      abstractGrammar,
      [
        {
          index: 0,
          nonTerminal: 'S',
          position: 0,
        },
        {
          index: 0,
          nonTerminal: 'P',
          position: 0,
        },
      ],
    ],
    out: ['P', '('],
  },
]);
