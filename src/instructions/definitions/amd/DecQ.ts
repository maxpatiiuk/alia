import { AmdInstruction } from './index.js';

export class DecQ extends AmdInstruction {
  public constructor(public readonly target: string) {
    super();
  }

  public toString(): string {
    return `decq ${this.target}`;
  }
}
