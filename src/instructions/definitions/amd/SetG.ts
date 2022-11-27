import { AmdInstruction } from './index.js';

export class SetG extends AmdInstruction {
  public constructor(public readonly destination: string) {
    super();
  }

  public toString(): string {
    return `setg ${this.destination}`;
  }
}
