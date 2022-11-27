import { MipsInstruction } from './index.js';

export class Mult extends MipsInstruction {
  public constructor(
    public readonly left: string,
    public readonly right: string
  ) {
    super();
  }

  public toString(): string {
    return `mult ${this.left}, ${this.right}`;
  }
}
