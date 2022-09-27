import type { AbstractGrammar } from '../cykParser/contextFreeGrammar.js';
import type { RA } from '../utils/types.js';
import type { Closure } from './closure.js';
import { getClosureStates } from './closure.js';

export const getGoToSet = <T extends string>(
  grammar: AbstractGrammar<T>,
  items: RA<Closure<T>>,
  part: string
): RA<Closure<T>> =>
  Array.from(
    new Set(
      items
        .filter(
          ({ nonTerminal, index, position }) =>
            grammar[nonTerminal][index][position] === part
        )
        .flatMap(({ position, ...closure }) =>
          getClosureStates(grammar, {
            ...closure,
            position: position + 1,
          })
        )
        .map((closure) => JSON.stringify(closure))
    ),
    (closure) => JSON.parse(closure)
  );
