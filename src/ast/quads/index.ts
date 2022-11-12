import type { RA } from '../../utils/types.js';
import type { AstNode } from '../definitions/AstNode.js';
import type { Quad } from './definitions.js';

export type QuadsContext = {
  readonly requestLabel: () => string;
  readonly requestString: (value: string) => string;
  readonly requestTemp: () => string;
  readonly createTempGenerator: () => () => string;
  readonly returnLabel: string;
};

export function toQuads(ast: AstNode): RA<Quad> {
  let labelIndex = -1;
  let stringIndex = -1;

  function createTempGenerator(): () => string {
    let tempIndex = -1;
    return () => {
      tempIndex += 1;
      return `tmp${tempIndex}`;
    };
  }

  return ast.toQuads({
    requestLabel() {
      labelIndex += 1;
      return `lbl_${labelIndex}`;
    },
    requestTemp: createTempGenerator(),
    createTempGenerator,
    requestString() {
      stringIndex += 1;
      return `str_${stringIndex}`;
    },
    returnLabel: 'ERROR: Return label is not defined',
  });
}
