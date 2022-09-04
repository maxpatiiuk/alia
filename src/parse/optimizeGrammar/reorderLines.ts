import { isToken } from '../../tokenize/definitions.js';
import type { RA } from '../../utils/types.js';
import { sortFunction } from '../../utils/utils.js';
import type {
  AbstractGrammar,
  AbstractGrammarLine,
} from '../contextFreeGrammar.js';

/**
 * The matcher recursively follows the references in the grammar until it found
 * the token that matches, or backs out if nothing matches.
 *
 * To make the algorithm work faster, this algorithm reorders the union members
 * to put rules that are easier to match first, with recursive rules being last.
 */
export function reorderRules<T extends string>(
  grammar: AbstractGrammar<T>
): AbstractGrammar<T> {
  const recursiveRules = detectRecursiveRules(grammar);
  return Object.fromEntries(
    Object.entries(grammar).map(([name, lines]) => [
      name,
      Array.from(lines).sort(
        sortFunction((line) => calculateLineDifficulty(line, recursiveRules))
      ),
    ])
  );
}

export const detectRecursiveRules = <T extends string>(
  grammar: AbstractGrammar<T>
): RA<T> =>
  Object.keys(grammar).filter((rule) => isRecursiveRule(rule, grammar));

export const isRecursiveRule = <T extends string>(
  rule: T,
  grammar: AbstractGrammar<T>,
  past: RA<T> = []
): boolean =>
  grammar[rule].some((line) =>
    line.some(
      (part) =>
        !isToken(part) &&
        (past.includes(part) || isRecursiveRule(part, grammar, [...past, rule]))
    )
  );

/**
 * Tokens have negative difficulty cost as they help discriminate between rules
 */
export const tokenCost = -10;
export const recursionCost = 200;
export const nonRecursiveRuleCost = 10;

export const calculateLineDifficulty = <T extends string>(
  line: AbstractGrammarLine<T>,
  recursiveRules: RA<T>
): number =>
  line.length === 0
    ? Number.NEGATIVE_INFINITY
    : line
        .map((part) =>
          isToken(part)
            ? tokenCost
            : recursiveRules.includes(part)
            ? recursionCost
            : nonRecursiveRuleCost
        )
        .reduce<number>((a, b) => a + b, 0);
