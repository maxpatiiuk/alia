import { AmdInstruction } from './index.js';

export class Neg extends AmdInstruction {
  public constructor(public readonly destination: string) {
    super();
  }

  public toString(): string {
    return `neg ${this.destination}`;
  }
}
