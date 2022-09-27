import type { Action } from 'typesafe-reducer';

import type {
  AbstractGrammar,
  AbstractGrammarLine,
} from '../cykParser/contextFreeGrammar.js';
import { getFirstSets } from '../firstFollowSets/firstSets.js';
import { getFollowSets } from '../firstFollowSets/followSets.js';
import type { IR, RA } from '../utils/types.js';
import { split } from '../utils/utils.js';
import type { Closure } from './closure.js';
import type { DiagramNode } from './stateDiagram.js';
import { buildStateDiagram } from './stateDiagram.js';

type Move = Action<'Move', { readonly to: number }>;
type Accept = Action<'Accept'>;
type Reduce<T extends string> = Action<'Reduce', { readonly to: Closure<T> }>;
export type TableCell<T extends string> = Accept | Move | Reduce<T> | undefined;
export type SlrTable<T extends string> = RA<IR<TableCell<T>>>;

export function getTable<T extends string>(
  grammar: AbstractGrammar<T>
): SlrTable<T> {
  const firstSets = getFirstSets(grammar);
  const followSets = getFollowSets(grammar, firstSets);
  const diagram = buildStateDiagram(grammar);
  return buildTable(grammar, diagram, followSets);
}

function buildTable<T extends string>(
  grammar: AbstractGrammar<T>,
  diagram: RA<DiagramNode<T>>,
  followSet: IR<ReadonlySet<string>>
): SlrTable<T> {
  const startState = Object.keys(grammar)[0];
  const { terminals, nonTerminals } = splitGrammar(grammar);

  return diagram.map(({ closure, edges }) => {
    const reducibleClosures = closure.filter(
      ({ nonTerminal, index, position }) =>
        grammar[nonTerminal][index].length === position
    );
    const hasStartState = reducibleClosures.some(
      ({ nonTerminal }) => nonTerminal === startState
    );
    const reducers = hasStartState
      ? {}
      : Object.fromEntries(
          reducibleClosures.flatMap((closure) =>
            Array.from(followSet[closure.nonTerminal], (terminal) => [
              terminal,
              closure,
            ])
          )
        );

    return Object.fromEntries(
      [...terminals, ...nonTerminals, ''].map((part) => {
        if (part === '' && hasStartState) return [part, { type: 'Accept' }];
        else if (part in reducers)
          return [part, { type: 'Reduce', to: reducers[part] }];
        else if (part in edges)
          return [part, { type: 'Move', to: edges[part] }];
        else return [part, undefined];
      })
    );
  });
}

export function splitGrammar<T extends string>(
  grammar: AbstractGrammar<T>
): {
  readonly terminals: RA<string>;
  readonly nonTerminals: RA<T>;
} {
  const [terminals, nonTerminals] = split(
    Array.from(
      new Set([
        Object.keys(grammar)[0],
        ...Object.values<RA<AbstractGrammarLine<T>>>(grammar).flat(2),
      ])
    ),
    (key) => key in grammar
  );
  return { terminals, nonTerminals: nonTerminals as RA<T> };
}
