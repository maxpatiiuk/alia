import { Instruction } from './index.js';

export class TextSection extends Instruction {
  public constructor() {
    super();
  }

  public toString(): string {
    return '.text';
  }
}
