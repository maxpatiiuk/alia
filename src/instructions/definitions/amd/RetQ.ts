import {AmdInstruction} from './index.js';

export class RetQ extends AmdInstruction {
  public constructor(
  ) {
    super();
  }

  public toString(): string {
    return 'retq';
  }
}