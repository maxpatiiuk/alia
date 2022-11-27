import { RA } from '../../utils/types.js';
import { Instruction } from './index.js';

export class Globl extends Instruction {
  public constructor(public readonly labels: RA<string>) {
    super();
  }

  public toString(): string {
    return `.globl ${this.labels.join(', ')}`;
  }
}
