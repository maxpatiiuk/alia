import {AmdInstruction} from './index.js';

export class IncQ extends AmdInstruction {
  public constructor(
    public readonly target: string,
  ) {
    super();
  }

  public toString(): string {
    return `incq ${this.target}`;
  }
}