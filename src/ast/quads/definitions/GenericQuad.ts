import type { RR, RA } from '../../../utils/types.js';
import { Quad } from './index.js';

type Mode = 'mips' | 'quad';

export class GenericQuad extends Quad {
  private readonly data: Partial<RR<Mode, string>>;

  public constructor(data: Partial<RR<Mode, string>> | string) {
    super();
    this.data = typeof data === 'object' ? data : { quad: data, mips: data };
  }

  public toString(): RA<string> {
    return typeof this.data.quad === 'string' ? [this.data.quad] : [];
  }

  public toMips() {
    return typeof this.data.mips === 'string' ? [this.data.mips] : [];
  }
}

export class MipsQuad extends GenericQuad {
  public constructor(name: string, operation?: string) {
    super({
      mips: `${name}${operation === undefined ? '' : ` ${operation}`}`,
    });
  }
}
