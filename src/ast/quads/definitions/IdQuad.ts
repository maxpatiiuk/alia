import { mem, mipsSize, Quad } from './index.js';
import { TermQuad } from './TermQuad.js';
import { formatGlobalVariable } from './GlobalVarQuad.js';

export class IdQuad extends Quad {
  private readonly quad: Quad;

  public constructor(
    private readonly name: string,
    private readonly tempVariable: string | number
  ) {
    super();
    this.quad = new TermQuad(mem(this.name));
  }

  public toString() {
    return this.quad.toString();
  }

  public toValue() {
    return this.quad.toValue();
  }

  public toMips() {
    return [];
  }

  public toMipsValue() {
    return reg(this.tempVariable);
  }
}

/**
 * Resolve global variable name or temporary variable index into a register name
 */
export const reg = (tempVariable: string | number) =>
  typeof tempVariable === 'string'
    ? `(${formatGlobalVariable(tempVariable)})`
    : `-${tempVariable * mipsSize}($fp)`;
