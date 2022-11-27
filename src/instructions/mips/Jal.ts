import { MipsInstruction } from './index.js';

export class Jal extends MipsInstruction {
  public constructor(
    public readonly label: string,
  ) {
    super();
  }

  public toString(): string {
    return `jal ${this.label}`;
  }
}
