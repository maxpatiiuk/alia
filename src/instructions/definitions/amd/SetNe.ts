import { AmdInstruction } from './index.js';

export class SetNe extends AmdInstruction {
  public constructor(public readonly destination: string) {
    super();
  }

  public toString(): string {
    return `setne ${this.destination}`;
  }
}
