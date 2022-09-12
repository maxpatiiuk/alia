import type { Token } from '../tokenize/types.js';
import type { IR, R, RA } from '../utils/types.js';
import { filterArray } from '../utils/types.js';
import { group } from '../utils/utils.js';
import type { AbstractGrammar, GrammarKey } from './contextFreeGrammar.js';
import { grammar, grammarRoot } from './contextFreeGrammar.js';

export function parse(tokens: RA<Token>): boolean {
  const isNullable = grammar()[grammarRoot()].some((line) => line.length === 0);
  if (tokens.length === 0) {
    if (isNullable) return true;
    // TODO: turn this into a syntax error
    else throw new Error('Grammar does not allow an empty string');
  } else return cykParser(tokens);
}

/**
 * References:
 * https://www.geeksforgeeks.org/cyk-algorithm-for-context-free-grammar/
 * https://www.youtube.com/watch?v=VTH1k-xiswM
 * https://courses.engr.illinois.edu/cs447/fa2018/Slides/Lecture09.pdf
 * https://cyberzhg.github.io/toolbox/cfg2cnf
 * https://www.xarg.org/tools/cyk-algorithm/
 */
export function cykParser(tokens: RA<Token>): boolean {
  const result = powerSetIterate(tokens);
  return result[tokensToString(tokens)].includes(grammarRoot());
}

export const setJoinSymbol = ' ';
export const tokensToString = (subSet: RA<Token>): string =>
  subSet.map((token) => token.type).join(setJoinSymbol);

/**
 * This was initially implemented by creating a power set and iterating over
 * the sorted power set elements. However, that quickly caused performance
 * issues as the power set grows exponentially with the number of tokens.
 * (for 31 tokens, the power set has 2^31 = 2 billion items)
 */
export function powerSetIterate(tokens: RA<Token>): IR<RA<GrammarKey>> {
  const store: R<RA<GrammarKey>> = {};
  const getValue = (subSet: RA<Token>): RA<GrammarKey> =>
    store[tokensToString(subSet)];

  tokens.forEach((_, index) =>
    (index === 0 ? tokens : tokens.slice(0, -index)).forEach(
      (_, startIndex) => {
        const subSet = tokens.slice(startIndex, startIndex + index + 1);
        const subSetString = tokensToString(subSet);
        store[subSetString] ??= powerSetIteratorCallback(subSet, getValue);
      }
    )
  );
  return store;
}

export const powerSetIteratorCallback = (
  subSet: RA<Token>,
  getValue: (subSet: RA<Token>) => RA<GrammarKey>
): RA<GrammarKey> =>
  subSet.length === 1
    ? reverseIndexedGrammar[subSet[0].type]
    : subSet.flatMap((_, index) => {
        if (index === 0) return [];
        const left = getValue(subSet.slice(0, index));
        const right = getValue(subSet.slice(index));
        return matchRulePairs(getCartesianProduct(left, right));
      });

export const getInverseGrammarIndex = <T extends string>(
  grammar: AbstractGrammar<T>
): IR<RA<T>> =>
  Object.fromEntries(
    group(
      Object.entries(grammar).flatMap(([ruleName, lines]) =>
        lines.map((line) => [line.join(setJoinSymbol), ruleName] as const)
      )
    )
  );
export const reverseIndexedGrammar = getInverseGrammarIndex(grammar());

export const getCartesianProduct = <T>(
  left: RA<T>,
  right: RA<T>
): RA<readonly [T, T]> =>
  left.flatMap((leftItem) => right.map((rightItem) => [leftItem, rightItem]));

export const matchRulePairs = (
  pairs: RA<readonly [GrammarKey, GrammarKey]>
): RA<GrammarKey> =>
  filterArray(
    pairs.flatMap(
      ([left, right]) =>
        reverseIndexedGrammar[[left, right].join(setJoinSymbol)]
    )
  );
