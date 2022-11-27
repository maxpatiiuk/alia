import { MipsInstruction } from './index.js';

export class Div extends MipsInstruction {
  public constructor(
    public readonly left: string,
    public readonly right: string
  ) {
    super();
  }

  public toString(): string {
    return `div ${this.left}, ${this.right}`;
  }
}
