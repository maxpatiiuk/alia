import { AmdInstruction } from './index.js';

export class Jmp extends AmdInstruction {
  // eslint-disable-next-line functional/prefer-readonly-type
  public constructor(public label: string) {
    super();
  }

  public toString(): string {
    return `jmp ${this.label}`;
  }
}
