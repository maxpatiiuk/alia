/**
 * Generate closure states for a given position in the grammar
 *
 * Read more about it in http://www.egr.unlv.edu/~matt/teaching/SLR.pdf
 */

import { saturate } from '../firstFollowSets/firstSets.js';
import type { IR, R, RA } from '../utils/types.js';
import { filterArray } from '../utils/types.js';
import { PureGrammar } from '../grammar/utils.js';

export type Closure<T extends string> = {
  readonly nonTerminal: T;
  readonly index: number;
  readonly position: number;
};

const toString = JSON.stringify;

const store = new WeakMap<PureGrammar<string>, R<RA<Closure<string>>>>();

export function getClosureStates<T extends string>(
  grammar: PureGrammar<T>,
  closure: Closure<T>
): RA<Closure<T>> {
  if (!store.has(grammar)) store.set(grammar, {});
  const computed = store.get(grammar)!;
  computed[toString(closure)] ??= buildClosureStates(grammar, closure);
  return computed[toString(closure)] as RA<Closure<T>>;
}

/**
 * Build closures for all possible states
 */
const buildClosureStates = <T extends string>(
  grammar: PureGrammar<T>,
  { nonTerminal, index, position }: Closure<T>
): RA<Closure<T>> =>
  Object.values(
    saturate<IR<Closure<T>>>(
      (closure) => Object.keys(closure).length,
      (rawClosure) => {
        const closure = { ...rawClosure };
        const startClosure = { nonTerminal, index, position };
        closure[toString(startClosure)] = startClosure;
        searchRelated(grammar, closure).forEach((newClosure) => {
          closure[toString(newClosure)] = newClosure;
        });
        return closure;
      },
      {}
    )
  );

/**
 * Add to closure all preparations that begin with what is already in the
 * closure
 */
const searchRelated = <T extends string>(
  grammar: PureGrammar<T>,
  closure: IR<Closure<T>>
): RA<Closure<T>> =>
  reduceClosure(grammar, Object.values(closure))
    .filter((part): part is T => part in grammar)
    .flatMap((part) =>
      grammar[part].map((_line, index) => ({
        nonTerminal: part,
        index,
        position: 0,
      }))
    );

/**
 * Turn array of closures into array of parts that closures are pointing at
 */
export const reduceClosure = <T extends string>(
  grammar: PureGrammar<T>,
  closure: RA<Closure<T>>
): RA<string> =>
  filterArray(
    Array.from(
      new Set(
        closure.map(
          ({ nonTerminal, index, position }) =>
            grammar[nonTerminal][index][position]
        )
      )
    )
  );
