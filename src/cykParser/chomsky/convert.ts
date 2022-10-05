import { isToken } from '../../tokenize/definitions.js';
import type { R, RA } from '../../utils/types.js';
import { simplifyGrammar } from './simplify.js';
import {PureGrammar} from '../../grammar/utils.js';

/**
 * Convert grammar to Chomsky Normal Form
 */
export const toChomsky = <T extends string>(
  grammar: PureGrammar<T>
): PureGrammar<T> => splitLongLines(maskTokens(simplifyGrammar(grammar)));

const ruleJoinSymbol = '__';

/**
 * Make all rules contain at most 2 elements.
 * Converts rules like A->BCD into A->ED, E->BC
 */
export function splitLongLines<T extends string>(
  grammar: PureGrammar<T>
): PureGrammar<T> {
  const split: R<RA<T>> = {};
  const formatRule = (stream: RA<string>): string =>
    `${ruleJoinSymbol}${stream.join(ruleJoinSymbol)}`;
  const processed: PureGrammar<T> = Object.fromEntries([
    ...Object.entries(grammar).map(([name, lines]) => [
      name,
      lines.map((line) => {
        if (line.length > 2) {
          const localLine = line as RA<T>;
          const separatedRules = localLine.slice(0, 2);
          const formatted = formatRule(separatedRules);
          split[formatted] = separatedRules;
          const remainingRules = localLine.slice(2);
          return [formatted, ...remainingRules];
        } else return line;
      }),
    ]),
    ...Object.entries(split).map(([formatted, stream]) => [
      formatted,
      [stream],
    ]),
  ]);
  return Object.keys(split).length === 0
    ? processed
    : splitLongLines(processed);
}

/** Convert rules like like B->xx into B->XX and X->x */
export function maskTokens<T extends string>(
  grammar: PureGrammar<T>
): PureGrammar<T> {
  const usedTokens = new Set<T>();
  const formatToken = (token: T): string => `${ruleJoinSymbol}${token}`;
  return Object.fromEntries([
    ...Object.entries(grammar).map(([name, lines]) => [
      name,
      lines.map((line) =>
        line.length === 1
          ? line
          : line.map((part) => {
              if (isToken(part)) {
                const token = part as T;
                usedTokens.add(token);
                return formatToken(token);
              } else return part;
            })
      ),
    ]),
    ...Array.from(usedTokens, (token) => [formatToken(token), [[token]]]),
  ]);
}
