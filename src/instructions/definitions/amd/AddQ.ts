import { AmdInstruction } from './index.js';

export class AddQ extends AmdInstruction {
  public constructor(
    public readonly source: string,
    public readonly destination: string
  ) {
    super();
  }

  public toString(): string {
    return `addq ${this.source}, ${this.destination}`;
  }
}
