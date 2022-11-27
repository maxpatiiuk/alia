import {AmdInstruction} from './index.js';

export class SetL extends AmdInstruction {
  public constructor(
    public readonly source: string,
    public readonly destination: string
  ) {
    super();
  }

  public toString(): string {
    return `setl ${this.source}, ${this.destination}`;
  }
}