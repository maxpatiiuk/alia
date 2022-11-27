import { AmdInstruction } from './index.js';

export class PushQ extends AmdInstruction {
  public constructor(public readonly register: string) {
    super();
  }

  public toString(): string {
    return `push ${this.register}`;
  }
}
