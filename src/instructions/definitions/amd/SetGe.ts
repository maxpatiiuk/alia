import { AmdInstruction } from './index.js';

export class SetGe extends AmdInstruction {
  public constructor(public readonly destination: string) {
    super();
  }

  public toString(): string {
    return `setge ${this.destination}`;
  }
}
