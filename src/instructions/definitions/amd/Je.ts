import { AmdInstruction } from './index.js';

export class Je extends AmdInstruction {
  public constructor(
    // eslint-disable-next-line functional/prefer-readonly-type
    public label: string
  ) {
    super();
  }

  public toString(): string {
    return `je ${this.label}`;
  }
}
