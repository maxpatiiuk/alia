import { Quad } from './index.js';

export class NopQuad extends Quad {
  public toString() {
    return ['nop'];
  }

  public toMips() {
    return ['sll $zero $zero 0  # nop'];
  }
}
