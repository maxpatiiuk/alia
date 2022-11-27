import { MipsInstruction } from './index.js';

export class Andi extends MipsInstruction {
  public constructor(
    public readonly destination: string,
    public readonly source: string,
    public readonly immediate: string
  ) {
    super();
  }

  public toString(): string {
    return `andi ${this.destination}, ${this.source}, ${this.immediate}`;
  }
}
