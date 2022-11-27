import { MipsInstruction } from './index.js';

export class Slt extends MipsInstruction {
  public constructor(
    public readonly destination: string,
    public readonly left: string,
    public readonly right: string
  ) {
    super();
  }

  public toString(): string {
    return `slt ${this.destination}, ${this.left}, ${this.right}`;
  }
}
