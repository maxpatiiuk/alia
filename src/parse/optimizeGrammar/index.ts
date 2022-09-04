import type { AbstractGrammar } from '../contextFreeGrammar.js';
import { epsilon, typeFixRule } from '../contextFreeGrammar.js';
import { reorderRules } from './reorderLines.js';
import { splitGrammar } from './splitGrammar.js';

/**
 * Do various performance optimizations on the grammar
 */
export const optimizeGrammar = <T extends string>(
  grammar: AbstractGrammar<T>
): AbstractGrammar<T> => reorderRules(removeTypeFixes(splitGrammar(grammar)));

/**
 * Epsilon rules where replaced with '__' to simplify typing.
 * This replaces that with empty array
 */
export const removeTypeFixes = <T extends string>(
  grammar: AbstractGrammar<T>
): AbstractGrammar<T> =>
  Object.fromEntries(
    Object.entries(grammar)
      .filter(([name]) => name !== epsilon[0] && name !== typeFixRule)
      .map(([name, lines]) => [
        name,
        lines.map((line) => line.filter((part) => part !== epsilon[0])),
      ])
  );
