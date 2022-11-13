import type { RA } from '../../../utils/types.js';
import { LabelQuad } from './LabelQuad.js';

export class Quad {
  /** Convert quad to a printable string */
  public toString(): RA<LabelQuad | string> {
    throw new Error('Not implemented');
  }

  /** Get the name of the temp variable created by the quad */
  public toValue(): string {
    throw new Error('Not implemented');
  }
}

/** Wrap an identifier in square brackets (indicates memory access) */
export const mem = (id: string): string => `[${id}]`;

export const quadsToString = (quads: RA<Quad>): RA<LabelQuad | string> =>
  quads.flatMap((quad) => (quad instanceof LabelQuad ? quad : quad.toString()));
