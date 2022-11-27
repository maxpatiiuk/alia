import { AmdInstruction } from './index.js';

export class Jz extends AmdInstruction {
  public constructor(
    public readonly value: string,
    // eslint-disable-next-line functional/prefer-readonly-type
    public label: string
  ) {
    super();
  }

  public toString(): string {
    return `jz ${this.value}, ${this.label}`;
  }
}