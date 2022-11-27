import {AmdInstruction} from './index.js';

export class AndQ extends AmdInstruction {
  public constructor(
    public readonly source: string,
    public readonly destination: string
  ) {
    super();
  }

  public toString(): string {
    return `andq ${this.source}, ${this.destination}`;
  }
}