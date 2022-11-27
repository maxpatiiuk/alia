import {Instruction} from './index.js';

export class DataSection extends Instruction {
  public constructor(
  ) {
    super();
  }

  public toString(): string {
    return '.data';
  }
}