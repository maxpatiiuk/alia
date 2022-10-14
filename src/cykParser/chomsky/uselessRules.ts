import { error } from '../../utils/assert.js';
import type { RA } from '../../utils/types.js';
import { AbstractGrammar, epsilon, PureGrammar } from '../../grammar/utils.js';

export function removeUselessProductions<T extends string>(
  grammar: PureGrammar<T>
): PureGrammar<T> {
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

  Object.entries(grammar).forEach(([name, lines]) =>
    lines.forEach((line, index) => {
      if (line.length !== 0 && typeof line.at(-1) !== 'function')
        throw new Error(
          `Expected last part of the ${index} line in ${name} rule to be a ` +
            `function (needed for Syntax Directed Translation)`
        );
      if (
        line.some(
          (part, index, { length }) =>
            typeof part === 'function' && index + 1 !== length
        )
      )
        throw new Error(
          `A Syntax Directed Translation is only supported as the last element of the line`
        );
    })
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
