import type { AbstractGrammar } from '../../cykParser/contextFreeGrammar.js';
import type { Tokens } from '../../tokenize/tokens.js';
import { buildStateDiagram } from '../stateDiagram.js';

const abstractGrammar: AbstractGrammar<'L' | 'P' | 'S'> = {
  S: [['P']],
  P: [['LPAREN', 'L', 'RPAREN']],
  L: [['ID'], ['L', 'ID']],
};

const recursiveGrammar: AbstractGrammar<'S' | 'X'> = {
  S: [['X']],
  X: [['a' as keyof Tokens, 'X'], ['a' as keyof Tokens]],
};

describe('buildStateDiagram', () => {
  test('simple grammar', () =>
    expect(buildStateDiagram(abstractGrammar)).toEqual([
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
          LPAREN: 2,
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
          ID: 4,
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
          RPAREN: 5,
          ID: 6,
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
    ]));

  // This diagram has an edge pointing back at itself
  test('recursive grammar', () =>
    expect(buildStateDiagram(recursiveGrammar)).toEqual([
      {
        closure: [
          {
            index: 0,
            nonTerminal: 'S',
            position: 0,
          },
          {
            index: 0,
            nonTerminal: 'X',
            position: 0,
          },
          {
            index: 1,
            nonTerminal: 'X',
            position: 0,
          },
        ],
        edges: {
          X: 1,
          a: 2,
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
            nonTerminal: 'X',
            position: 1,
          },
          {
            index: 0,
            nonTerminal: 'X',
            position: 0,
          },
          {
            index: 1,
            nonTerminal: 'X',
            position: 0,
          },
          {
            index: 1,
            nonTerminal: 'X',
            position: 1,
          },
        ],
        edges: {
          X: 3,
          a: 2,
        },
      },
      {
        closure: [
          {
            index: 0,
            nonTerminal: 'X',
            position: 2,
          },
        ],
        edges: {},
      },
    ]));
});
