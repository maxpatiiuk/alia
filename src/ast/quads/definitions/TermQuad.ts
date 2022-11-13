import type { RA } from '../../../utils/types.js';
import { Quad } from './index.js';

export class TermQuad extends Quad {
  public constructor(private readonly term: string) {
    super();
  }

  public toString(): RA<string> {
    return [];
  }

  public toValue(): string {
    return this.term;
  }
}
