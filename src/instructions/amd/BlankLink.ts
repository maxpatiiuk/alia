import { AmdInstruction } from './index.js';

export class BlankLine extends AmdInstruction {
  public constructor() {
    super();
  }

  public toString(): string {
    return '';
  }
}
