import { AmdInstruction } from './index.js';

export class Jz extends AmdInstruction {
  public constructor(
    public readonly value: string,
    public readonly label: string
  ) {
    super();
  }

  public toString(): string {
    return `jz ${this.value}, ${this.label}`;
  }
}
