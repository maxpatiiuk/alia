import fs from 'node:fs';

import type { PureGrammar } from '../grammar/utils.js';
import type { Closure } from '../slrParser/closure.js';
import type { DiagramNode } from '../slrParser/stateDiagram.js';
import type { RA } from '../utils/types.js';
import { insertItem } from '../utils/utils.js';

export const createGraph = async <T extends string>(
  grammar: PureGrammar<T>,
  diagram: RA<DiagramNode<T>>,
  diagramPath: string
): Promise<void> =>
  fs.promises.writeFile(diagramPath, translateGraph(diagram, grammar));

const translateGraph = <T extends string>(
  graph: RA<DiagramNode<T>>,
  grammar: PureGrammar<T>
): string =>
  `digraph Grammar {
  rankdir=LR;
  node [ shape=square ];
  edge [ style=solid ];
  
  ${createNodes(graph, grammar)}
  
  ${createEdges(graph)}
  
}`;

const createNodes = <T extends string>(
  graph: RA<DiagramNode<T>>,
  grammar: PureGrammar<T>
): string =>
  graph
    .map(
      ({ closure }, index) =>
        ` ${index} [ label="${index}\n${createLabel(closure, grammar)}" ];`
    )
    .join('\n');

const createLabel = <T extends string>(
  closure: RA<Closure<T>>,
  grammar: PureGrammar<T>
): string =>
  closure
    .map(({ nonTerminal, index, position }) => {
      const line = grammar[nonTerminal][index] as RA<string>;
      return `${nonTerminal}→${insertItem(line, position, '•').join(' ')}`;
    })
    .join('\n');

const createEdges = <T extends string>(graph: RA<DiagramNode<T>>): string =>
  graph
    .flatMap(({ edges }, index) =>
      Object.entries(edges).map(
        ([on, to]) => ` ${index} -> ${to} [ label="${on}" ];`
      )
    )
    .join('\n');

export const exportsForTests = {
  translateGraph,
};
