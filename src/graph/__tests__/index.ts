import type { PureGrammar } from '../../grammar/utils.js';
import { buildStateDiagram } from '../../slrParser/stateDiagram.js';
import { exportsForTests } from '../index.js';

const { translateGraph } = exportsForTests;

test('Generating a graph', () => {
  const grammar: PureGrammar<'A' | 'B'> = {
    A: [['B'], []],
    B: [
      ['NOT', 'B'],
      ['LPAREN', 'B'],
      ['RPAREN', 'ARROW', 'IF'],
    ],
  };

  expect(translateGraph(buildStateDiagram(grammar), grammar)).toMatchSnapshot();
});
