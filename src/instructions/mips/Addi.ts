import { MipsInstruction } from './index.js';

export class Addi extends MipsInstruction {
  public constructor(
    public readonly destination: string,
    public readonly source: string,
    public readonly immediate: number
  ) {
    super();
  }

  public toString(): string {
    return `addi ${this.destination}, ${this.source}, ${this.immediate}`;
  }
}
