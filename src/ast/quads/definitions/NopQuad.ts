import { Quad } from './index.js';

export class NopQuad extends Quad {
  public toString() {
    return ['nop'];
  }

  public toMips() {
    return ['nop'];
  }

  public toAmd() {
    return ['nop'];
  }
}
