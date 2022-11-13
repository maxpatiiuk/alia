import type { RA } from '../../utils/types.js';
import type { AstNode } from '../definitions/AstNode.js';
import type { Quad } from './definitions/index.js';

export type QuadsContext = {
  readonly requestLabel: () => string;
  readonly requestString: (value: string) => string;
  readonly requestTemp: () => string;
  readonly createTempGenerator: () => () => string;
  readonly signalVarDeclaration: (name: string) => void;
  readonly returnLabel: string;
};

export function toQuads(ast: AstNode): RA<Quad> {
  let labelIndex = -1;

  function createTemporaryGenerator(): () => string {
    let temporaryIndex = -1;
    return () => {
      temporaryIndex += 1;
      return `tmp${temporaryIndex}`;
    };
  }

  return ast.toQuads({
    requestLabel() {
      labelIndex += 1;
      return `lbl_${labelIndex}`;
    },
    requestTemp: createTemporaryGenerator(),
    createTempGenerator: createTemporaryGenerator,
    requestString() {
      throw new Error('Not Implemented');
    },
    signalVarDeclaration: () => undefined,
    returnLabel: 'ERROR: Return label is not defined',
  });
}
