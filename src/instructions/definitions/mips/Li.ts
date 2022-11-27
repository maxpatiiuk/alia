import { MipsInstruction } from './index.js';

export class Li extends MipsInstruction {
  public constructor(
    public readonly destination: string,
    public readonly source: number
  ) {
    super();
  }

  public toString(): string {
    return `li ${this.destination}, ${this.source}`;
  }
}
