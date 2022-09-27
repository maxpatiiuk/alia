import type { RA } from '../../utils/types.js';
import { filterArray } from '../../utils/types.js';
import { removeItem, sortFunction } from '../../utils/utils.js';
import type {
  AbstractGrammar,
  AbstractGrammarLine,
} from '../contextFreeGrammar.js';
import { getGrammarRoot } from './uselessRules.js';

/**
 * Get rid of epsilon productions
 */
export function removeNullProductions<T extends string>(
  grammar: AbstractGrammar<T>
): AbstractGrammar<T> {
  const rulesWithEpsilons = Object.entries(grammar)
    .filter(([_name, lines]) => lines.some((line) => line.length === 0))
    .map(([name]) => name);
  const rawNullableRules = findNullableRules(grammar, rulesWithEpsilons);
  const grammarRoot = getGrammarRoot(grammar);
  const isRootNullable =
    rulesWithEpsilons.includes(grammarRoot) ||
    rawNullableRules.includes(grammarRoot);
  const nullableRules = [
    ...rulesWithEpsilons,
    ...rawNullableRules.filter((rule) => rule !== grammarRoot),
  ];
  return Object.fromEntries(
    Object.entries(grammar).map(([name, lines]) => [
      name,
      filterArray([
        ...lines
          .filter((line) => line.length > 0)
          .flatMap((line) => eliminateEpsilons(line, nullableRules)),
        isRootNullable && name === grammarRoot ? [] : undefined,
      ]),
    ])
  );
}

export function findNullableRules<T extends string>(
  grammar: AbstractGrammar<T>,
  rulesWithEpsilons: RA<string>,
  discoveredRules: RA<string> = []
): RA<string> {
  const newDiscoveredRules = Object.entries(grammar)
    .filter(
      ([name, lines]) =>
        !discoveredRules.includes(name) &&
        !rulesWithEpsilons.includes(name) &&
        lines.some((line) =>
          line.every(
            (part) =>
              rulesWithEpsilons.includes(part) || discoveredRules.includes(part)
          )
        )
    )
    .map(([name]) => name);
  return newDiscoveredRules.length === 0
    ? []
    : [
        ...newDiscoveredRules,
        ...findNullableRules(grammar, rulesWithEpsilons, [
          ...discoveredRules,
          ...newDiscoveredRules,
        ]),
      ];
}

export function eliminateEpsilons<T extends string>(
  line: AbstractGrammarLine<T>,
  nullableRules: RA<string>
): RA<AbstractGrammarLine<T>> {
  const nullableIndexes = getPowerSet(
    filterArray(
      line.map((part, index) =>
        nullableRules.includes(part) ? index : undefined
      )
    )
  )
    // Prevent creation of empty lines
    .filter((indexes) => indexes.length !== line.length)
    .map((indexes) => Array.from(indexes).sort(sortFunction((index) => index)));
  return nullableIndexes.map((indexes) =>
    indexes.reduceRight(removeItem, line)
  );
}

/** Adapted from https://stackoverflow.com/a/47147597/8584605 */
export const getPowerSet = <T>(array: RA<T>): RA<RA<T>> =>
  array.reduce<RA<RA<T>>>(
    (subsets, value) => [...subsets, ...subsets.map((set) => [...set, value])],
    [[]]
  );
