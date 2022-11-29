import type { RA } from '../utils/types.js';
import type { Closure } from './closure.js';
import { getClosureStates } from './closure.js';
import { PureGrammar } from '../grammar/utils.js';

/**
 * Calculate GoTo sets for the given place in the grammar
 *
 * More information: https://en.wikipedia.org/wiki/LR_parser#Go_to_function
 */
export const getGoToSet = <T extends string>(
  grammar: PureGrammar<T>,
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
