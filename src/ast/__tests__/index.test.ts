import { exportsForTests } from '../index.js';
import { theories } from '../../tests/utils.js';
import {
  FormalsDeclNode,
  GlobalsNode,
  StatementList,
  TypeListNode,
} from '../definitions.js';

const { indexParts } = exportsForTests;

const nodes = [
  new GlobalsNode([]),
  new FormalsDeclNode([]),
  new StatementList([]),
  new TypeListNode([]),
] as const;
describe('a', () => {
  theories(indexParts, [
    {
      in: [['a', 'b', 'a', 'd'], nodes],
      out: {
        a: nodes[0],
        b: nodes[1],
        a2: nodes[2],
        d: nodes[3],
      },
    },
  ]);
});
