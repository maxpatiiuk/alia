import { Quad } from './index.js';

export class NopQuad extends Quad {
  public toString() {
    return ['nop'];
  }
}
