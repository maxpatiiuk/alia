import { Instruction } from './index.js';

export class Label extends Instruction {
  public constructor(public readonly label: string) {
    super();
  }
}
