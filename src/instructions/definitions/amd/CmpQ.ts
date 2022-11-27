import { AmdInstruction } from './index.js';

export class CmpQ extends AmdInstruction {
  public constructor(
    public readonly left: string,
    public readonly right: string
  ) {
    super();
  }

  public toString(): string {
    return `cmpq ${this.left}, ${this.right}`;
  }
}
