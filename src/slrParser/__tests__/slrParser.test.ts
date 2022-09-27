import type { AbstractGrammar } from '../../cykParser/contextFreeGrammar.js';
import { slrParser } from '../index.js';

const abstractGrammar: AbstractGrammar<'L' | 'P' | 'S'> = {
  S: [['MAYHEM', 'P', 'MAYHEM']],
  P: [['LPAREN', 'L', 'RPAREN']],
  L: [['ID'], ['L', 'ID']],
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
              token: 'L',
            },
            {
              data: {},
              simplePosition: 0,
              type: 'RPAREN',
            },
          ],
          token: 'P',
        },
        {
          data: {},
          simplePosition: 0,
          type: 'MAYHEM',
        },
      ],
      token: 'S',
    }));
});
