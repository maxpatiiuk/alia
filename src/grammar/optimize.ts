/**
 * Run various optimizations and conversions on the context free grammar.
 *
 * The intention is to:
 * - Validate the grammar and report bugs/ambiguities
 * - Keep letting the programmer define the grammar in a more user-friendly
 *   way
 * - But, change the grammar on the fly in a way that improves performance and
 *   simplifies the code (by removing epsilon productions, for example)
 * - While doing above, preserve the semantics of the grammar
 */

import { checkValidity } from '../cykParser/chomsky/uselessRules.js';
import { AbstractGrammar, epsilon } from './utils.js';

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
