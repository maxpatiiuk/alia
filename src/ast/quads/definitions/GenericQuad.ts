import type { RA } from '../../../utils/types.js';
import { Quad } from './index.js';

type Mode = 'mips' | 'string';

export class GenericQuad extends Quad {
  private readonly value: string;

  public constructor(
    private readonly modes: RA<Mode>,
    name: string,
    operation: string | undefined
  ) {
    super();
    this.value = `${name}${operation === undefined ? '' : ` ${operation}`}`;
  }

  public toString(): RA<string> {
    return this.modes.includes('string') ? [this.value] : [];
  }

  public toMips() {
    return this.modes.includes('mips') ? [this.value] : [];
  }
}

export class PrintQuad extends GenericQuad {
  public constructor(name: string, operation?: string) {
    super(['string'], name, operation);
  }
}

export class MipsQuad extends GenericQuad {
  public constructor(name: string, operation?: string) {
    super(['mips'], name, operation);
  }
}
