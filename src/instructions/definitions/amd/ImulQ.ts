import {AmdInstruction} from './index.js';

export class ImulQ extends AmdInstruction {
  public constructor(
    public readonly destination: string
  ) {
    super();
  }

  public toString(): string {
    return `imulq ${this.destination}`;
  }
}