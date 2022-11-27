import {AmdInstruction} from './index.js';

export class SubQ extends AmdInstruction {
  public constructor(
    public readonly source: string,
    public readonly destination: string
  ) {
    super();
  }

  public toString(): string {
    return `subq ${this.source}, ${this.destination}`;
  }
}