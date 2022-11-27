import { MipsInstruction } from './index.js';

export class Lw extends MipsInstruction {
  public constructor(
    public readonly destination: string,
    public readonly source: string,
  ) {
    super();
  }

  public toString(): string {
    return `lw ${this.destination}, ${this.source}`;
  }
}
