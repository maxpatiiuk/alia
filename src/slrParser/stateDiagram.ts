import { getGrammarRoot } from '../cykParser/chomsky/uselessRules.js';
import { saturate } from '../firstFollowSets/firstSets.js';
import type { IR, RA } from '../utils/types.js';
import { replaceItem } from '../utils/utils.js';
import type { Closure } from './closure.js';
import { getClosureStates, reduceClosure } from './closure.js';
import { getGoToSet } from './goTo.js';
import {PureGrammar} from '../grammar/utils.js';

export type DiagramNode<T extends string> = {
  readonly closure: RA<Closure<T>>;
  readonly edges: IR<number>;
};

export function buildStateDiagram<T extends string>(
  grammar: PureGrammar<T>
): RA<DiagramNode<T>> {
  const diagram: RA<DiagramNode<T>> = [
    {
      closure: getClosureStates(grammar, {
        nonTerminal: getGrammarRoot(grammar),
        index: 0,
        position: 0,
      }),
      edges: {},
    },
  ];
  return buildDiagram(grammar, diagram);
}

const buildDiagram = <T extends string>(
  grammar: PureGrammar<T>,
  diagram: RA<DiagramNode<T>>
): RA<DiagramNode<T>> =>
  saturate<readonly [diagram: RA<DiagramNode<T>>, visited: RA<number>]>(
    ([diagram]) => diagram.length,
    ([diagram, visited]) => {
      const newVisited = Array.from(visited);
      const newDiagram = diagram.reduce((diagram, node, index) => {
        if (visited.includes(index)) return diagram;
        const { closure } = node;
        newVisited.push(index);
        const entries = Object.fromEntries(
          reduceClosure(grammar, closure).map(
            (part) => [part, getGoToSet(grammar, closure, part)] as const
          )
        );
        return produceNodes(diagram, node, entries);
      }, diagram);
      return [newDiagram, newVisited];
    },
    [diagram, []]
  )[0];

/**
 * Expand the diagram with new nodes based on go to set of the current node
 */
function produceNodes<T extends string>(
  diagram: RA<DiagramNode<T>>,
  node: DiagramNode<T>,
  rawEntries: IR<RA<Closure<T>>>
): RA<DiagramNode<T>> {
  const entries = detectRecursive(diagram, rawEntries);
  return [
    ...replaceItem(diagram, diagram.indexOf(node), {
      closure: node.closure,
      edges: Object.fromEntries([
        ...Object.entries(entries)
          .filter((entry): entry is [string, RA<Closure<T>>] =>
            Array.isArray(entry[1])
          )
          .map(([part, resolved], index) => [
            part,
            typeof resolved === 'number' ? resolved : diagram.length + index,
          ]),
        ...Object.entries(entries).filter(
          (entry): entry is [string, number] => typeof entry[1] === 'number'
        ),
      ]),
    }),
    ...Object.values(entries)
      .filter((entry): entry is RA<Closure<T>> => Array.isArray(entry))
      .map((closure) => ({
        closure,
        edges: {},
      })),
  ];
}

/**
 * Rather than creating nodes with identical closure, detect such cases and
 * point back to the existing closure.
 *
 * Otherwise, recursive references may cause infinite loops.
 */
const detectRecursive = <T extends string>(
  diagram: RA<DiagramNode<T>>,
  entries: IR<RA<Closure<T>>>
): IR<RA<Closure<T>> | number> =>
  Object.fromEntries(
    Object.entries(entries).map(([part, newClosure]) => {
      const stringified = new Set(
        newClosure.map((closure) => JSON.stringify(closure))
      );
      const reference = diagram.findIndex(
        ({ closure }) =>
          closure.length === newClosure.length &&
          closure.every((part) => stringified.has(JSON.stringify(part)))
      );
      return [part, reference === -1 ? newClosure : reference] as const;
    })
  );
