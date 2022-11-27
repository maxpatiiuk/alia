import { MipsInstruction } from './index.js';

export class J extends MipsInstruction {
  public constructor(
    public readonly label: string,
  ) {
    super();
  }

  public toString(): string {
    return `j ${this.label}`;
  }
}
