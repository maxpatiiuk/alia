import { AmdInstruction } from './index.js';

export class Not extends AmdInstruction {
  public constructor(public readonly destination: string) {
    super();
  }

  public toString(): string {
    return `not ${this.destination}`;
  }
}
