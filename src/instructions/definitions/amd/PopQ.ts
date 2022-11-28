import { AmdInstruction } from './index.js';

export class PopQ extends AmdInstruction {
  public constructor(public readonly register: string) {
    super();
  }

  public toString(): string {
    return `popq ${this.register}`;
  }
}
