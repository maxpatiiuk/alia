import {AmdInstruction} from './index.js';

export class CallQ extends AmdInstruction {
  public constructor(
    public readonly label: string,
  ) {
    super();
  }

  public toString(): string {
    return `callq ${this.label}`;
  }
}