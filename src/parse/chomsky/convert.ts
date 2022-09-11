import { isToken } from '../../tokenize/definitions.js';
import type { R, RA } from '../../utils/types.js';
import type { AbstractGrammar } from '../contextFreeGrammar.js';
import { ruleJoinSymbol } from '../optimizeGrammar/splitGrammar.js';
import { simplifyGrammar } from './simplify.js';

/**
 * Convert grammar to Chomsky Normal Form
 */
export const toChomsky = <T extends string>(
  grammar: AbstractGrammar<T>
): AbstractGrammar<T> =>
  maskTokens(splitLongLines(eliminateIntermixing(simplifyGrammar(grammar))));

/**
 * Refactor rules that contain both terminal and non-terminal symbols to make
 * them refer to non-terminal only.
 *
 * Rules that refer to terminal only are left as is.
 */
export function eliminateIntermixing<T extends string>(
  grammar: AbstractGrammar<T>
): AbstractGrammar<T> {
  const tokenJoinSymbol = ' ';
  const globalTokenStreams = new Set<string>();
  const formatRule = (stream: string): string =>
    `${ruleJoinSymbol}${stream.split(tokenJoinSymbol).join(ruleJoinSymbol)}`;
  return Object.fromEntries([
    ...Object.entries(grammar).map(([name, lines]) => [
      name,
      lines.map((line) => {
        if (line.some(isToken) && !line.every(isToken)) {
          const streams = line
            .map((part) =>
              isToken(part) ? part : `${ruleJoinSymbol}${part}${ruleJoinSymbol}`
            )
            .join(tokenJoinSymbol)
            .split(ruleJoinSymbol)
            .filter((stream) => stream.trim().length > 0);
          const tokenStreams = streams.filter((stream) =>
            stream.includes(tokenJoinSymbol)
          );
          tokenStreams.forEach((stream) =>
            globalTokenStreams.add(stream.trim())
          );
          return streams.map((stream) =>
            stream.includes(tokenJoinSymbol)
              ? formatRule(stream.trim())
              : stream
          );
        } else return line;
      }),
    ]),
    ...Array.from(globalTokenStreams, (stream) => [
      formatRule(stream),
      [stream.split(tokenJoinSymbol)],
    ]),
  ]);
}

/**
 * Make all rules contain at most 2 elements.
 * Converts rules like A->BCD into A->ED, E->BC
 */
export function splitLongLines<T extends string>(
  grammar: AbstractGrammar<T>
): AbstractGrammar<T> {
  const split: R<RA<T>> = {};
  const formatRule = (stream: RA<string>): string =>
    `${ruleJoinSymbol}${stream.join(ruleJoinSymbol)}`;
  const processed: AbstractGrammar<T> = Object.fromEntries([
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
  grammar: AbstractGrammar<T>
): AbstractGrammar<T> {
  const usedTokens = new Set<T>();
  const formatToken = (token: T) => `${ruleJoinSymbol}${token}`;
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
