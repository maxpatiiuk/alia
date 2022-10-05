import type { IR, RA} from '../utils/types.js';
import {filterArray} from '../utils/types.js';

/**
 * Computer first sets for all non-terminals and sequences of terminals
 */
export function getFirstSets(grammar: PureGrammar): IR<ReadonlySet<string>> {
  const allKeys = Array.from(
    new Set(
      [
        [],
        ...Object.keys(grammar).map((item) => [item]),
        ...Object.values(grammar).flat().flatMap(findAllSubsets),
      ].map(lineToString)
    )
  );

  return saturateSets(
    saturateFirstSets.bind(undefined, grammar),
    Object.fromEntries(allKeys.map((key) => [key, new Set()]))
  );
}

export const findAllSubsets = <T>(array: RA<T>): RA<RA<T>> =>
  array.flatMap((_, index) =>
    array
      .slice(index)
      .map((_, length) => array.slice(index, index + length + 1))
  );

export type PureGrammar = IR<RA<RA<string>>>;

export const lineToString = (line: RA<string>): string =>
  JSON.stringify(filterArray(line));

/**
 * Call a hash-set producing function until the result does not change
 */
export function saturate<T>(
  getLength: (structure: T) => number,
  callback: (sets: T) => T,
  initialSets: T
): T {
  const initialLength = getLength(initialSets);
  const newSets = callback(initialSets);
  return getLength(newSets) === initialLength
    ? newSets
    : saturate(getLength, callback, newSets);
}

/**
 * Calculate the total length of all sets
 * Used to determine if the first sets have stabilized
 */
const getSetsLength = (firstSets: IR<ReadonlySet<string>>): number =>
  Object.values(firstSets).reduce((sum, { size }) => sum + size, 0);

export const saturateSets = saturate<IR<ReadonlySet<string>>>.bind(
  undefined,
  getSetsLength
);

/**
 * Recursive algorithm for computing first sets.
 * Stops when no more changes are made to the first sets
 */
const saturateFirstSets = (
  grammar: PureGrammar,
  firstSets: IR<ReadonlySet<string>>
): IR<ReadonlySet<string>> =>
  Object.fromEntries(
    Object.keys(firstSets).map((key) => {
      const parts = JSON.parse(key) as RA<string>;
      if (parts.length === 0) return [key, new Set([''])];

      const firstSet = new Set<string>();
      const hasEpsilon = parts.every((part) => {
        const newFirstSet = buildSet(grammar, firstSets, part);
        Array.from(newFirstSet, (part) =>
          part === '' ? undefined : firstSet.add(part)
        );
        return newFirstSet.has('');
      });

      if (hasEpsilon) firstSet.add('');
      return [key, firstSet];
    })
  );

/**
 * Build a first set for a single terminal or non-terminal
 */
function buildSet(
  grammar: PureGrammar,
  firstSets: IR<ReadonlySet<string>>,
  part: string
): ReadonlySet<string> {
  const isTerminal = !(part in grammar);
  return new Set(
    isTerminal
      ? [part]
      : grammar[part]
          .map(lineToString)
          .flatMap((line) => Array.from(firstSets[line]))
  );
}

export const exportsForTests = {
  lineToString,
  saturateFirstSets,
  buildSet,
  getSetsLength,
};
