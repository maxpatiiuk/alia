import { AmdInstruction } from './index.js';

export class SetE extends AmdInstruction {
  public constructor(public readonly destination: string) {
    super();
  }

  public toString(): string {
    return `sete ${this.destination}`;
  }
}
