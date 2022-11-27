import { MipsInstruction } from './index.js';

export class Sw extends MipsInstruction {
  public constructor(
    public readonly source: string,
    public readonly destination: string
  ) {
    super();
  }

  public toString(): string {
    return `sw ${this.source}, ${this.destination}`;
  }
}
