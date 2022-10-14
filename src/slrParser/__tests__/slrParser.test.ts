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
        { type: 'MAYHEM', data: {}, simplePosition: 0 },
        { type: 'LPAREN', data: {}, simplePosition: 0 },
        { type: 'ID', data: { literal: 'a' }, simplePosition: 0 },
        { type: 'RPAREN', data: {}, simplePosition: 0 },
        { type: 'MAYHEM', data: {}, simplePosition: 0 },
      ])
    ).toEqual({
      children: [
        {
          data: {},
          simplePosition: 0,
          type: 'MAYHEM',
        },
        {
          children: [
            {
              data: {},
              simplePosition: 0,
              type: 'LPAREN',
            },
            {
              children: [
                {
                  data: {
                    literal: 'a',
                  },
                  simplePosition: 0,
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
              simplePosition: 0,
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
          simplePosition: 0,
          type: 'MAYHEM',
        },
      ],
      closure: {
        index: 0,
        nonTerminal: 'S',
      },
    }));
});
