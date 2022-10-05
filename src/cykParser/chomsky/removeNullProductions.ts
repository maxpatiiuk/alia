import type {
  AbstractGrammar, AbstractGrammarLine,
  PureGrammar,
  PureGrammarLine
} from '../../grammar/utils.js';
import type {RA} from '../../utils/types.js';
import {filterArray} from '../../utils/types.js';
import {removeItem, sortFunction} from '../../utils/utils.js';
import {getGrammarRoot} from './uselessRules.js';

/**
 * Get rid of epsilon productions
 */
export function removeNullProductions<T extends string, GRAMMAR_TYPE extends AbstractGrammar<T> | PureGrammar<T>>(
  grammar: GRAMMAR_TYPE
): GRAMMAR_TYPE {
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
  const newGrammar: AbstractGrammar<T> =  Object.fromEntries(
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
  return newGrammar as GRAMMAR_TYPE;
}

export function findNullableRules<T extends string, GRAMMAR_TYPE extends AbstractGrammar<T> | PureGrammar<T>>(
  grammar: GRAMMAR_TYPE,
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
              typeof part === 'string' && (
                rulesWithEpsilons.includes(part) || discoveredRules.includes(part))
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

export function eliminateEpsilons<T extends string, LINE_TYPE extends AbstractGrammarLine<T> | PureGrammarLine<T>>(
  line: LINE_TYPE,
  nullableRules: RA<string>
): RA<LINE_TYPE> {
  const nullableIndexes = getPowerSet(
    filterArray(
      line.map((part, index) =>
        typeof part === 'string' && nullableRules.includes(part) ? index : undefined
      )
    )
  )
    // Prevent creation of empty lines
    .filter((indexes) => indexes.length !== line.length)
    .map((indexes) => Array.from(indexes).sort(sortFunction((index) => index)));
  return nullableIndexes.map((indexes) =>
    indexes.reduceRight((line, index) => removeItem(line, index) as LINE_TYPE, line)
  );
}

/** Adapted from https://stackoverflow.com/a/47147597/8584605 */
export const getPowerSet = <T>(array: RA<T>): RA<RA<T>> =>
  array.reduce<RA<RA<T>>>(
    (subsets, value) => [...subsets, ...subsets.map((set) => [...set, value])],
    [[]]
  );
