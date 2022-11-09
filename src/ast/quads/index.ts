import type { RA } from '../../utils/types.js';
import type { AstNode } from '../definitions/AstNode.js';
import type { Quad } from './definitions.js';

export type QuadsContext = {
  readonly requestLabel: () => string;
  readonly requestTemp: () => string;
  readonly createContext: () => QuadsContext;
};

export function toQuads(ast: AstNode): RA<Quad> {
  let labelIndex = 0;

  function createContext(): QuadsContext {
    let tempIndex = 0;
    return {
      requestLabel() {
        labelIndex += 1;
        return `lbl_${labelIndex}`;
      },
      requestTemp() {
        tempIndex += 1;
        return `tmp${tempIndex}`;
      },
      createContext,
    };
  }

  return ast.toQuads(createContext());
}
