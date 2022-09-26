import type { AbstractGrammar } from '../../cykParser/contextFreeGrammar.js';
import { theories } from '../../tests/utils.js';
import type { Tokens } from '../../tokenize/tokens.js';
import { buildStateDiagram } from '../stateDiagram.js';

const abstractGrammar: AbstractGrammar<'L' | 'P' | 'S'> = {
  S: [['P']],
  P: [['(' as keyof Tokens, 'L', ')' as keyof Tokens]],
  L: [['id' as keyof Tokens], ['L', 'id' as keyof Tokens]],
};

theories(buildStateDiagram, [
  {
    in: [abstractGrammar],
    out: [
      {
        closure: [
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
        edges: {
          '(': 2,
          P: 1,
        },
      },
      {
        closure: [
          {
            index: 0,
            nonTerminal: 'S',
            position: 1,
          },
        ],
        edges: {},
      },
      {
        closure: [
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
        edges: {
          L: 3,
          id: 4,
        },
      },
      {
        closure: [
          {
            index: 0,
            nonTerminal: 'P',
            position: 2,
          },
          {
            index: 1,
            nonTerminal: 'L',
            position: 1,
          },
        ],
        edges: {
          ')': 5,
          id: 6,
        },
      },
      {
        closure: [
          {
            index: 0,
            nonTerminal: 'L',
            position: 1,
          },
        ],
        edges: {},
      },
      {
        closure: [
          {
            index: 0,
            nonTerminal: 'P',
            position: 3,
          },
        ],
        edges: {},
      },
      {
        closure: [
          {
            index: 1,
            nonTerminal: 'L',
            position: 2,
          },
        ],
        edges: {},
      },
    ],
  },
]);
