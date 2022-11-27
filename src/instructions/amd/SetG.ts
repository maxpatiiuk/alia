import { AmdInstruction } from './index.js';

export class SetG extends AmdInstruction {
  public constructor(
    public readonly source: string,
    public readonly destination: string
  ) {
    super();
  }

  public toString(): string {
    return `setg ${this.source}, ${this.destination}`;
  }
}
