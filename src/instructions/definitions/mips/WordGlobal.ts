import { MipsInstruction } from './index.js';

export class WordGlobal extends MipsInstruction {
  public constructor(public readonly defaultValue: number) {
    super();
  }

  public toString(): string {
    return `.word ${this.defaultValue}`;
  }
}
