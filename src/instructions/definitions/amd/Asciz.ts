import { AmdInstruction } from './index.js';

export class Asciz extends AmdInstruction {
  public constructor(public readonly value: string) {
    super();
  }

  public toString(): string {
    return `.asciz ${this.value}`;
  }
}
