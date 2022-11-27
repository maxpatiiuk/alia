import { MipsInstruction } from './index.js';

export class Move extends MipsInstruction {
  public constructor(
    public readonly destination: string,
    public readonly source: string
  ) {
    super();
  }

  public toString(): string {
    return `move ${this.destination}, ${this.source}`;
  }
}
