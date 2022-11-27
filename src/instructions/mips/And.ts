import { MipsInstruction } from './index.js';

export class And extends MipsInstruction {
  public constructor(
    public readonly destination: string,
    public readonly left: string,
    public readonly right: string
  ) {
    super();
  }

  public toString(): string {
    return `and ${this.destination}, ${this.left}, ${this.right}`;
  }
}
