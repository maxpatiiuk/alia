import { exportsForTests } from '../index.js';
import { theories } from '../../tests/utils.js';
import { GlobalsNode } from '../definitions/GlobalsNode.js';
import { TypeListNode } from '../definitions/types/TypeListNode.js';
import { FormalsDeclNode } from '../definitions/FormalsDeclNode.js';
import { StatementList } from '../definitions/statement/StatementList.js';

const { indexParts } = exportsForTests;

const nodes = [
  new GlobalsNode([]),
  new FormalsDeclNode([]),
  new StatementList([]),
  new TypeListNode([]),
] as const;

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
