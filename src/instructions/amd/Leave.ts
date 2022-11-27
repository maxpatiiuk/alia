import {AmdInstruction} from './index.js';

export class Leave extends AmdInstruction {
  public constructor(
  ) {
    super();
  }

  public toString(): string {
    return 'leave';
  }
}