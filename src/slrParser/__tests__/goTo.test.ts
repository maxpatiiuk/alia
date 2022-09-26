import type { AbstractGrammar } from '../../cykParser/contextFreeGrammar.js';
import { theories } from '../../tests/utils.js';
import type { Tokens } from '../../tokenize/tokens.js';
import { getClosureStates } from '../closure.js';
import { getGoToSet } from '../goTo.js';

const abstractGrammar: AbstractGrammar<'L' | 'P' | 'S'> = {
  S: [['P']],
  P: [['(' as keyof Tokens, 'L', ')' as keyof Tokens]],
  L: [['id' as keyof Tokens], ['L', 'id' as keyof Tokens]],
};
const closures = getClosureStates(abstractGrammar, {
  nonTerminal: 'S',
  index: 0,
  position: 0,
});

theories(getGoToSet, [
  {
    in: [abstractGrammar, closures, 'P'],
    out: getClosureStates(abstractGrammar, {
      nonTerminal: 'S',
      index: 0,
      position: 1,
    }),
  },
  {
    in: [abstractGrammar, closures, '('],
    out: getClosureStates(abstractGrammar, {
      nonTerminal: 'P',
      index: 0,
      position: 1,
    }),
  },
]);
