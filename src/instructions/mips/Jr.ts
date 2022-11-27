import { MipsInstruction } from './index.js';

export class Jr extends MipsInstruction {
  public constructor(
    public readonly register: string,
  ) {
    super();
  }

  public toString(): string {
    return `jr ${this.register}`;
  }
}
