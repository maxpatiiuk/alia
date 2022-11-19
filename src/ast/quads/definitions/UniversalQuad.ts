import type { RA, RR } from '../../../utils/types.js';
import { Quad } from './index.js';

type Mode = 'amd' | 'mips' | 'quad';

export class UniversalQuad extends Quad {
  private readonly data: Partial<RR<Mode, string>>;

  public constructor(data: Partial<RR<Mode, string>> | string) {
    super();
    this.data =
      typeof data === 'object'
        ? data
        : {
            quad: data,
            mips: data,
            amd: data,
          };
  }

  public toString(): RA<string> {
    return typeof this.data.quad === 'string' ? [this.data.quad] : [];
  }

  public toMips() {
    return typeof this.data.mips === 'string' ? [this.data.mips] : [];
  }

  public toAmd() {
    return typeof this.data.amd === 'string' ? [this.data.amd] : [];
  }
}

export class MipsQuad extends UniversalQuad {
  public constructor(name: string, operation?: string) {
    super({
      mips: `${name}${operation === undefined ? '' : ` ${operation}`}`,
    });
  }
}

export class AmdQuad extends UniversalQuad {
  public constructor(name: string, operation?: string) {
    super({
      amd: `${name}${operation === undefined ? '' : ` ${operation}`}`,
    });
  }
}
