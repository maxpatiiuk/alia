import type { AbstractGrammar } from '../cykParser/contextFreeGrammar.js';
import { saturate } from '../firstFollowSets/firstSets.js';
import type { IR, RA } from '../utils/types.js';
import { replaceItem } from '../utils/utils.js';
import type { Closure } from './closure.js';
import { getClosureStates, reduceClosure } from './closure.js';
import { getGoToSet } from './goTo.js';

type DiagramNode<T extends string> = {
  readonly closure: RA<Closure<T>>;
  readonly edges: IR<number>;
};

export function buildStateDiagram<T extends string>(
  grammar: AbstractGrammar<T>
): RA<DiagramNode<T>> {
  const diagram: RA<DiagramNode<T>> = [
    {
      closure: getClosureStates(grammar, {
        nonTerminal: Object.keys(grammar)[0],
        index: 0,
        position: 0,
      }),
      edges: {},
    },
  ];
  return buildDiagram(grammar, diagram);
}

const buildDiagram = <T extends string>(
  grammar: AbstractGrammar<T>,
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
const produceNodes = <T extends string>(
  diagram: RA<DiagramNode<T>>,
  node: DiagramNode<T>,
  entries: IR<RA<Closure<T>>>
): RA<DiagramNode<T>> => [
  ...replaceItem(diagram, diagram.indexOf(node), {
    closure: node.closure,
    edges: Object.fromEntries(
      Object.keys(entries).map((part, index) => [part, diagram.length + index])
    ),
  }),
  ...Object.values(entries).map((closure) => ({ closure, edges: {} })),
];
