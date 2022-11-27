import { AmdInstruction } from './index.js';

export class SetLe extends AmdInstruction {
  public constructor(public readonly destination: string) {
    super();
  }

  public toString(): string {
    return `setle ${this.destination}`;
  }
}
