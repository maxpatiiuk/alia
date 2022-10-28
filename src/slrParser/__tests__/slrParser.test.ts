import { slrParser } from '../index.js';
import { AbstractGrammar } from '../../grammar/utils.js';
import { TypeListNode } from '../../ast/definitions.js';

const ast = () => new TypeListNode([]);

const abstractGrammar: AbstractGrammar<'L' | 'P' | 'S'> = {
  S: [['MAYHEM', 'P', 'MAYHEM', ast]],
  P: [['LPAREN', 'L', 'RPAREN', ast]],
  L: [
    ['ID', ast],
    ['L', 'ID', ast],
  ],
};

describe('slrParser', () => {
  test('simple grammar', () =>
    expect(
      slrParser(abstractGrammar, [
        {
          type: 'MAYHEM',
          data: {},
          position: { lineNumber: 1, columnNumber: 1 },
        },
        {
          type: 'LPAREN',
          data: {},
          position: { lineNumber: 1, columnNumber: 2 },
        },
        {
          type: 'ID',
          data: { literal: 'a' },
          position: { lineNumber: 1, columnNumber: 3 },
        },
        {
          type: 'RPAREN',
          data: {},
          position: { lineNumber: 1, columnNumber: 4 },
        },
        {
          type: 'MAYHEM',
          data: {},
          position: { lineNumber: 1, columnNumber: 5 },
        },
      ])
    ).toEqual({
      children: [
        {
          data: {},
          position: { lineNumber: 1, columnNumber: 1 },
          type: 'MAYHEM',
        },
        {
          children: [
            {
              data: {},
              position: { lineNumber: 1, columnNumber: 2 },
              type: 'LPAREN',
            },
            {
              children: [
                {
                  data: {
                    literal: 'a',
                  },
                  position: { lineNumber: 1, columnNumber: 3 },
                  type: 'ID',
                },
              ],
              closure: {
                index: 0,
                nonTerminal: 'L',
                position: 1,
              },
            },
            {
              data: {},
              position: { lineNumber: 1, columnNumber: 4 },
              type: 'RPAREN',
            },
          ],
          closure: {
            index: 0,
            nonTerminal: 'P',
            position: 3,
          },
        },
        {
          data: {},
          position: { lineNumber: 1, columnNumber: 5 },
          type: 'MAYHEM',
        },
      ],
      closure: {
        index: 0,
        nonTerminal: 'S',
      },
    }));
});
