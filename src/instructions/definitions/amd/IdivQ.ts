import { AmdInstruction } from './index.js';

export class IdivQ extends AmdInstruction {
  public constructor(public readonly destination: string) {
    super();
  }

  public toString(): string {
    return `idivq ${this.destination}`;
  }
}
