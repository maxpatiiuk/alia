import { getGrammarRoot } from '../cykParser/chomsky/uselessRules.js';
import type { IR, RA} from '../utils/types.js';
import {filterArray} from '../utils/types.js';
import type { PureGrammar } from './firstSets.js';
import { lineToString, saturateSets } from './firstSets.js';

/**
 * Compute follow sets for all non-terminals
 */
export const getFollowSets = (
  grammar: PureGrammar,
  firstSets: IR<ReadonlySet<string>>
): IR<ReadonlySet<string>> =>
  saturateSets(
    saturateFollowSets.bind(undefined, grammar, firstSets),
    Object.fromEntries(Object.keys(grammar).map((key) => [key, new Set()]))
  );

/**
 * An instance of the saturating algorithm for finding follow sets
 */
const saturateFollowSets = (
  grammar: PureGrammar,
  firstSets: IR<ReadonlySet<string>>,
  followSets: IR<ReadonlySet<string>>
): IR<ReadonlySet<string>> =>
  Object.fromEntries(
    Object.keys(followSets).map((key) => {
      const followSet = new Set<string>();

      // Is start non-terminal
      if (getGrammarRoot(grammar) === key) followSet.add('');

      findTerminalEndings(grammar, key).forEach(({ terminalName, ending }) => {
        const rawFirstSet = Array.from(firstSets[lineToString(ending)] ?? []);
        const firstSet = rawFirstSet.filter((part) => part !== '');
        [
          ...(firstSet.length === 0 || rawFirstSet.includes('')
            ? Array.from(followSets[terminalName])
            : []),
          ...firstSet,
        ].map((item) => followSet.add(item));
      });

      return [key, followSet];
    })
  );

/**
 * Return all parts of all lines to the right of a given terminal
 */
const findTerminalEndings = (
  grammar: PureGrammar,
  key: string
): RA<{ readonly terminalName: string; readonly ending: RA<string> }> =>
  Object.entries(grammar).flatMap(([terminalName, lines]) =>
    lines.flatMap((line) =>
      findAllIndexesOf(line, key)
        .map((index) => line.slice(index + 1))
        .map((ending) => ({ terminalName, ending }))
    )
  );

export const findAllIndexesOf = <T>(array: RA<T>, search: T): RA<number> =>
  filterArray(
    array.map((item, index) => (item === search ? index : undefined))
  );

export const exportsForTests = {
  findTerminalEndings,
  saturateFollowSets,
};
