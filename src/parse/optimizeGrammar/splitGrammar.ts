import { isToken } from '../../tokenize/definitions.js';
import type { RA } from '../../utils/types.js';
import { filterArray } from '../../utils/types.js';
import { split } from '../../utils/utils.js';
import type {
  AbstractGrammar,
  AbstractGrammarLine,
} from '../contextFreeGrammar.js';

// FIXME: check if this is still needed. if yes, add it back
/**
 * Factor out common parts of rules to reduce unneeded computation in case first
 * element of union does not match but the second one does.
 *
 * Turn something like:
 * ```
 * A ::= B C | B D
 * ```
 *
 * into:
 *
 * ```
 * A ::= B A__B
 * A__B ::= C | D
 * ```
 *
 * This way, if `B C` fails, we don't have to recheck `B` again for checking
 * the match against `B D`
 *
 */

export const splitGrammar = <T extends string>(
  grammar: AbstractGrammar<T>
): AbstractGrammar<T> =>
  Object.fromEntries(Object.entries(grammar).flatMap(optimizeLines));

export function optimizeLines<T extends string>([name, lines]: readonly [
  T,
  RA<AbstractGrammarLine<T>>
]): RA<readonly [T, RA<AbstractGrammarLine<T>>]> {
  const rules = filterArray(
    lines.map((line) => {
      const firstPart = line.at(0);
      return typeof firstPart === 'string' && isToken(firstPart)
        ? undefined
        : firstPart;
    })
  );
  const duplicateRules = rules.filter(
    (rule, index) => rules.indexOf(rule) !== index
  );
  return duplicateRules.reduce<RA<readonly [T, RA<AbstractGrammarLine<T>>]>>(
    (lines, duplicateRule) => deduplicateRule(duplicateRule, lines),
    [[name, lines]]
  );
}

export const ruleJoinSymbol = '__' as const;

export function deduplicateRule<T extends string>(
  deduplicateRule: T,
  [[name, originalLines], ...rest]: RA<readonly [T, RA<AbstractGrammarLine<T>>]>
): RA<readonly [T, RA<AbstractGrammarLine<T>>]> {
  /*
   * "newName" is not really in T, but doing it this way drastically simplifies
   * typing
   */
  const newName = `${name}${ruleJoinSymbol}${deduplicateRule}` as T;
  const [otherLines, duplicateLines] = split(
    originalLines,
    (line) => line[0] === deduplicateRule
  );
  const newRules = [
    [name, [...otherLines, [deduplicateRule, newName]]],
    [newName, duplicateLines.map((line) => line.slice(1))],
    ...rest,
  ] as const;
  return newRules.flatMap(([name, lines]) => optimizeLines([name, lines]));
}
