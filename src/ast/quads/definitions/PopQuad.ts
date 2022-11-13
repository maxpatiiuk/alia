import { mipsSize, Quad } from './index.js';
import { LoadQuad } from './LoadQuad.js';

export class PopQuad extends Quad {
  private readonly loadQuad: LoadQuad | undefined;

  public constructor(private readonly tempRegister: string | undefined) {
    super();
    this.loadQuad =
      this.tempRegister === undefined
        ? undefined
        : new LoadQuad(this.tempRegister, '0($sp)');
  }

  public toString() {
    return [];
  }

  public toMips() {
    return [...(this.loadQuad?.toMips() ?? []), `addi $sp, $sp, ${mipsSize}`];
  }

  public toMipsValue() {
    if (typeof this.tempRegister === 'string') return this.tempRegister;
    else throw new Error('Temp register is undefined');
  }
}
