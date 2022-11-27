import {AmdInstruction} from './index.js';

export class SetNe extends AmdInstruction {
  public constructor(
    public readonly source: string,
    public readonly destination: string
  ) {
    super();
  }

  public toString(): string {
    return `setne ${this.source}, ${this.destination}`;
  }
}