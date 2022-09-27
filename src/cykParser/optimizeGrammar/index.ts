import { checkValidity } from '../chomsky/uselessRules.js';
import type { AbstractGrammar } from '../contextFreeGrammar.js';
import { epsilon } from '../contextFreeGrammar.js';

/**
 * Do various performance optimizations on the grammar
 */
export const optimizeGrammar = <T extends string>(
  grammar: AbstractGrammar<T>
): AbstractGrammar<T> => checkValidity(removeTypeFixes(grammar));

/**
 * Epsilon rules where replaced with '__' to simplify typing.
 * This replaces that with empty array
 */
export const removeTypeFixes = <T extends string>(
  grammar: AbstractGrammar<T>
): AbstractGrammar<T> =>
  Object.fromEntries(
    Object.entries(grammar)
      .filter(([name]) => name !== epsilon[0])
      .map(([name, lines]) => [
        name,
        lines.map((line) => line.filter((part) => part !== epsilon[0])),
      ])
  );
