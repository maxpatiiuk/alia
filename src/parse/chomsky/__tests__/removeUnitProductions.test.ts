import { theories } from '../../../tests/utils.js';
import { removeUnitProductions } from '../removeUnitProductions.js';

test('removeUnitProductions', () => {
  expect(
    removeUnitProductions({
      a: [['b'], ['EQUALS']],
      b: [['TRUE' as 'a'], ['FALSE']],
    })
  ).toEqual({
    a: [['TRUE'], ['FALSE'], ['EQUALS']],
    b: [['TRUE'], ['FALSE']],
  });
});

theories(removeUnitProductions, [
  {
    in: [{ a: [['b'], ['EQUALS']], b: [['TRUE'], ['FALSE']] }],
    out: {
      a: [['TRUE'], ['FALSE'], ['EQUALS']],
      b: [['TRUE'], ['FALSE']],
    },
  },
]);
