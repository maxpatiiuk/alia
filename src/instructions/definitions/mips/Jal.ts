import { MipsInstruction } from './index.js';

export class Jal extends MipsInstruction {
  public constructor(
    // eslint-disable-next-line functional/prefer-readonly-type
    public label: string
  ) {
    super();
  }

  public toString(): string {
    return `jal ${this.label}`;
  }
}
