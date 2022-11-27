import { MipsInstruction } from './index.js';

export class Add extends MipsInstruction {
  public constructor(
    public readonly destination: string,
    public readonly left: string,
    public readonly right: string
  ) {
    super();
  }

  public toString(): string {
    return `add ${this.destination}, ${this.left}, ${this.right}`;
  }
}
