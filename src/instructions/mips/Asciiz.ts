import { MipsInstruction } from './index.js';

export class Asciiz extends MipsInstruction {
  public constructor(public readonly value: string) {
    super();
  }

  public toString(): string {
    return `.asciiz ${this.value}`;
  }
}
