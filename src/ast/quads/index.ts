import type { RA } from '../../utils/types.js';
import type { AstNode } from '../definitions/AstNode.js';
import { TempVariable } from './definitions/IdQuad.js';
import type { Quad } from './definitions/index.js';
import type { Register } from './definitions/Register.js';

export type QuadsContext = {
  readonly requestLabel: () => string;
  readonly requestString: (value: string) => string;
  readonly requestTemp: () => TempVariable;
  readonly getTempCount: () => number;
  readonly declareVar: (name: string) => TempVariable;
  readonly returnLabel: string;
  readonly requestTempRegister: () => Register;
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
    getTempCount: () => 0,
    requestString() {
      throw new Error('Not Implemented');
    },
    requestTempRegister() {
      throw new Error('Not Implemented');
    },
    declareVar(name: string) {
      return new TempVariable(name);
    },
    returnLabel: 'ERROR: Return label is not defined',
  });
}

export const formatTemp = (index: number) => `tmp${index}`;
