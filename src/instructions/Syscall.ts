import { Instruction } from './index.js';

export class Syscall extends Instruction {
  public constructor() {
    super();
  }

  public toString(): string {
    return 'syscall';
  }
}
