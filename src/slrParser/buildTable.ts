import type { Action } from 'typesafe-reducer';

import { getGrammarRoot } from '../cykParser/chomsky/uselessRules.js';
import { getFirstSets } from '../firstFollowSets/firstSets.js';
import { getFollowSets } from '../firstFollowSets/followSets.js';
import type { IR, RA } from '../utils/types.js';
import { split } from '../utils/utils.js';
import type { Closure } from './closure.js';
import type { DiagramNode } from './stateDiagram.js';
import { buildStateDiagram } from './stateDiagram.js';
import { PureGrammar, PureGrammarLine } from '../grammar/utils.js';

type Move = Action<'Move', { readonly to: number }>;
type Accept = Action<'Accept'>;
type Reduce<T extends string> = Action<
  'Reduce',
  { readonly to: Omit<Closure<T>, 'position'> }
>;
export type TableCell<T extends string> = Accept | Move | Reduce<T> | undefined;
export type SlrTable<T extends string> = RA<IR<TableCell<T>>>;

export function getTable<T extends string>(
  grammar: PureGrammar<T>
): SlrTable<T> {
  const firstSets = getFirstSets(grammar);
  const followSets = getFollowSets(grammar, firstSets);
  const diagram = buildStateDiagram(grammar);
  return buildTable(grammar, diagram, followSets);
}

function buildTable<T extends string>(
  grammar: PureGrammar<T>,
  diagram: RA<DiagramNode<T>>,
  followSet: IR<ReadonlySet<string>>
): SlrTable<T> {
  const startState = getGrammarRoot(grammar);
  const { terminals, nonTerminals } = splitGrammar(grammar);

  return diagram.map(({ closure, edges }) => {
    const reducibleClosures = closure.filter(
      ({ nonTerminal, index, position }) =>
        grammar[nonTerminal][index].length === position
    );
    const hasStartState = reducibleClosures.some(
      ({ nonTerminal }) => nonTerminal === startState
    );
    const rawReducers = hasStartState
      ? []
      : reducibleClosures.flatMap((closure) =>
          Array.from(followSet[closure.nonTerminal], (terminal) => [
            terminal,
            closure,
          ])
        );
    /*if (
      new Set(rawReducers.map(([terminal]) => terminal)).size !==
      rawReducers.length
    )
      throw new Error('Ambiguous grammar');*/
    const reducers = Object.fromEntries(rawReducers);

    return Object.fromEntries(
      [...terminals, ...nonTerminals, ''].map((part) => {
        const isReducer = part in reducers;
        const isEdge = part in edges;
        // if (isReducer && isEdge) throw new Error('Ambiguous grammar');
        if (part === '' && hasStartState) return [part, { type: 'Accept' }];
        else if (isReducer)
          return [part, { type: 'Reduce', to: reducers[part] }];
        else if (isEdge) return [part, { type: 'Move', to: edges[part] }];
        else return [part, undefined];
      })
    );
  });
}

export function splitGrammar<T extends string>(
  grammar: PureGrammar<T>
): {
  readonly terminals: RA<string>;
  readonly nonTerminals: RA<T>;
} {
  const [terminals, nonTerminals] = split(
    Array.from(
      new Set([
        getGrammarRoot(grammar),
        ...Object.values<RA<PureGrammarLine<T>>>(grammar).flat(2),
      ])
    ),
    (key) => key in grammar
  );
  return { terminals, nonTerminals: nonTerminals as RA<T> };
}
