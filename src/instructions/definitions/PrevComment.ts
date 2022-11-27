import { Instruction } from './index.js';

/** Add a comment to the previous line */
export class PrevComment extends Instruction {
  public constructor(public readonly comment: string) {
    super();
  }

  public toString(): string {
    return `#  ${this.comment}`;
  }
}
