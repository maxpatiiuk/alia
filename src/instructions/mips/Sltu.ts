import { MipsInstruction } from './index.js';

export class Sltu extends MipsInstruction {
  public constructor(
    public readonly destination: string,
    public readonly left: string,
    public readonly right: string
  ) {
    super();
  }

  public toString(): string {
    return `sltu ${this.destination}, ${this.left}, ${this.right}`;
  }
}
