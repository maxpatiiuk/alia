import { AmdInstruction } from './index.js';

export class Jmp extends AmdInstruction {
  public constructor(public readonly label: string) {
    super();
  }

  public toString(): string {
    return `.jmp ${this.label}`;
  }
}
