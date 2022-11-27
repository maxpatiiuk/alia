import { MipsInstruction } from './index.js';

export class Mflo extends MipsInstruction {
  public constructor(public readonly destination: string) {
    super();
  }

  public toString(): string {
    return `mflo ${this.destination}`;
  }
}
