import { MipsInstruction } from './index.js';

export class Sw extends MipsInstruction {
  public constructor(
    public readonly destination: string,
    public readonly source: string
  ) {
    super();
  }

  public toString(): string {
    return `sw ${this.destination}, ${this.source}`;
  }
}
