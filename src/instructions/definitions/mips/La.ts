import { MipsInstruction } from './index.js';

export class La extends MipsInstruction {
  public constructor(
    public readonly destination: string,
    public readonly address: string
  ) {
    super();
  }

  public toString(): string {
    return `la ${this.destination}, ${this.address}`;
  }
}
