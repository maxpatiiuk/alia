import {AmdInstruction} from './index.js';

export class SetGe extends AmdInstruction {
  public constructor(
    public readonly source: string,
    public readonly destination: string
  ) {
    super();
  }

  public toString(): string {
    return `setge ${this.source}, ${this.destination}`;
  }
}