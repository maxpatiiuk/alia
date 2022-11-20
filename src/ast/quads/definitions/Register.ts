import type { RA } from '../../../utils/types.js';
import { formatTemp } from '../index.js';
import { parseTempVar } from './FunctionQuad.js';
import { mem } from './IdQuad.js';
import { Quad } from './index.js';

export class Register extends Quad {
  private readonly amdRegister: string;

  public constructor(private readonly register: string, amdRegister?: string) {
    super();
    this.amdRegister = amdRegister ?? this.register;
  }

  public toString(): RA<string> {
    return [];
  }

  public toValue() {
    const index = parseTempVar(this.register);
    return mem(typeof index === 'number' ? formatTemp(index) : this.register);
  }

  public toMips() {
    return [];
  }

  public toMipsValue(): string {
    return this.register;
  }

  public toAmd() {
    return [];
  }

  public toAmdValue(): string {
    return this.amdRegister;
  }
}
