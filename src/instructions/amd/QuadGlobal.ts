import {AmdInstruction} from './index.js';

export class QuadGlobal extends AmdInstruction {
  public constructor(
    public readonly defaultValue: number,
  ) {
    super();
  }

  public toString(): string {
    return `.quad ${this.defaultValue}`;
  }
}