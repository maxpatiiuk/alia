import type { RA } from '../../utils/types.js';
import type { AstNode } from '../definitions/AstNode.js';
import type { Quad } from './definitions/index.js';

export type QuadsContext = {
  readonly requestLabel: () => string;
  readonly requestString: (value: string) => string;
  readonly requestTemp: () => number;
  readonly declareVar: (name: string) => string | number;
  readonly returnLabel: string;
  readonly requestTempRegister: () => string;
};

export function toQuads(ast: AstNode): RA<Quad> {
  let labelIndex = -1;

  return ast.toQuads({
    requestLabel() {
      labelIndex += 1;
      return `lbl_${labelIndex}`;
    },
    requestTemp() {
      throw new Error('not Implemented');
    },
    requestString() {
      throw new Error('Not Implemented');
    },
    requestTempRegister() {
      throw new Error('Not Implemented');
    },
    declareVar(name: string) {
      return name;
    },
    returnLabel: 'ERROR: Return label is not defined',
  });
}

export const formatTemp = (index: number) => `tmp${index}`;
