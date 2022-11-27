import {AmdInstruction} from './index.js';

export class OrQ extends AmdInstruction {
  public constructor(
    public readonly source: string,
    public readonly destination: string
  ) {
    super();
  }

  public toString(): string {
    return `orq ${this.source}, ${this.destination}`;
  }
}