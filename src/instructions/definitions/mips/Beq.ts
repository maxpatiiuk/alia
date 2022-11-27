import { MipsInstruction } from './index.js';

export class Beq extends MipsInstruction {
  public constructor(
    public left: string,
    public right: string,
    // eslint-disable-next-line functional/prefer-readonly-type
    public label: string
  ) {
    super();
  }

  public toString(): string {
    return `beq ${this.left}, ${this.right}, ${this.label}`;
  }
}
