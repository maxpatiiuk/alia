import { error } from '../../utils/assert.js';
import type { RA } from '../../utils/types.js';
import type { AbstractGrammar } from '../contextFreeGrammar.js';
import { epsilon } from '../contextFreeGrammar.js';

export function removeUselessProductions<T extends string>(
  grammar: AbstractGrammar<T>
): AbstractGrammar<T> {
  const unreachable = findUnreachableRules(grammar);
  return Object.fromEntries(
    Object.entries(grammar).filter(([name]) => !unreachable.includes(name))
  );
}

export function findUnreachableRules<T extends string>(
  grammar: AbstractGrammar<T>
): RA<T> {
  const reachable = new Set(
    Object.entries(grammar).flatMap(([name, lines]) =>
      lines.flatMap((line) => line.filter((part) => part !== name))
    )
  );
  const root = getGrammarRoot(grammar);
  reachable.add(root);
  return Object.keys(grammar).filter((key) => !reachable.has(key));
}

export function checkValidity<T extends string>(
  grammar: AbstractGrammar<T>
): AbstractGrammar<T> {
  findUnreachableRules(grammar).forEach((unreachable) =>
    error(`Unreachable rule detected in grammar: ${unreachable}`)
  );

  Object.entries(grammar)
    .filter(([name, lines]) => lines.every((line) => line.includes(name)))
    .forEach(([name]) =>
      error(
        `Rule ${name} is recursive with no epsilon condition, and will cause an infinite loop`
      )
    );

  Object.keys(grammar)
    .filter((key) => key.includes('_') && key !== epsilon[0])
    .forEach((name) =>
      error(`Grammar rule names must not contain underscores. Found: ${name}`)
    );

  Object.keys(grammar)
    .filter((key) => key.includes(' '))
    .forEach((name) =>
      error(`Grammar rule names must not contain spaces. Found: "${name}"`)
    );

  return grammar;
}

export const getGrammarRoot = <T extends string>(
  grammar: AbstractGrammar<T>
): T => Object.keys(grammar)?.[0] ?? error('Grammar cannot be empty');
