import { theories } from '../../tests/utils.js';
import type { Tokens } from '../../tokenize/tokens.js';
import { getTable, splitGrammar } from '../buildTable.js';
import { PureGrammar } from '../../grammar/utils.js';

const abstractGrammar: PureGrammar<'L' | 'P' | 'S'> = {
  S: [['P']],
  P: [['LPAREN', 'L', 'RPAREN']],
  L: [['ID'], ['L', 'ID']],
};

const recursiveGrammar: PureGrammar<'S' | 'X'> = {
  S: [['X']],
  X: [['a' as keyof Tokens, 'X'], ['a' as keyof Tokens]],
};

describe('buildTable', () => {
  test('regular grammar', async () =>
    expect(getTable(abstractGrammar)).resolves.toEqual([
      {
        LPAREN: {
          to: 2,
          type: 'Move',
        },
        P: {
          to: 1,
          type: 'Move',
        },
      },
      {
        '': {
          type: 'Accept',
        },
      },
      {
        L: {
          to: 3,
          type: 'Move',
        },
        ID: {
          to: 4,
          type: 'Move',
        },
      },
      {
        RPAREN: {
          to: 5,
          type: 'Move',
        },
        ID: {
          to: 6,
          type: 'Move',
        },
      },
      {
        RPAREN: {
          to: {
            index: 0,
            nonTerminal: 'L',
            position: 1,
          },
          type: 'Reduce',
        },
        ID: {
          to: {
            index: 0,
            nonTerminal: 'L',
            position: 1,
          },
          type: 'Reduce',
        },
      },
      {
        '': {
          to: {
            index: 0,
            nonTerminal: 'P',
            position: 3,
          },
          type: 'Reduce',
        },
      },
      {
        RPAREN: {
          to: {
            index: 1,
            nonTerminal: 'L',
            position: 2,
          },
          type: 'Reduce',
        },
        ID: {
          to: {
            index: 1,
            nonTerminal: 'L',
            position: 2,
          },
          type: 'Reduce',
        },
      },
    ]));
  test('recursive grammar', async () =>
    expect(getTable(recursiveGrammar)).resolves.toEqual([
      {
        X: {
          to: 1,
          type: 'Move',
        },
        a: {
          to: 2,
          type: 'Move',
        },
      },
      {
        '': {
          type: 'Accept',
        },
      },
      {
        '': {
          to: {
            index: 1,
            nonTerminal: 'X',
            position: 1,
          },
          type: 'Reduce',
        },
        X: {
          to: 3,
          type: 'Move',
        },
        a: {
          to: 2,
          type: 'Move',
        },
      },
      {
        '': {
          to: {
            index: 0,
            nonTerminal: 'X',
            position: 2,
          },
          type: 'Reduce',
        },
      },
    ]));
});

theories(splitGrammar, [
  {
    in: [{ a: [['a', 'b']], b: [['c']] }],
    out: { terminals: ['c'], nonTerminals: ['a', 'b'] },
  },
]);
