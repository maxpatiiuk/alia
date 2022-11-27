import { Instruction } from './index.js';

/** Add a comment to the next line */
export class NextComment extends Instruction {
  public constructor(public readonly comment: string) {
    super();
  }

  public toString(): string {
    return `#  ${this.comment}`;
  }
}
