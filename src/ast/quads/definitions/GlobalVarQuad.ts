import { LabelQuad, Quad } from './index.js';
import { UniversalQuad } from './UniversalQuad.js';

export class GlobalVarQuad extends Quad {
  private readonly name: string;

  private readonly quad: Quad | undefined;

  public constructor(
    private readonly id: string,
    private readonly value: number | undefined
  ) {
    super();

    this.name = formatGlobalVariable(this.id);
    this.quad =
      typeof this.value === 'number'
        ? new LabelQuad(
            this.name,
            new UniversalQuad({
              mips: `.word ${this.value}`,
              amd: `.quad ${this.value}`,
            })
          )
        : undefined;
  }

  public toString() {
    return [this.id];
  }

  public toMips() {
    return this.quad === undefined ? [] : this.quad.toMips();
  }

  public toAmd() {
    return this.quad === undefined ? [] : this.quad.toAmd();
  }
}

export const formatGlobalVariable = (name: string): string => `global_${name}`;
export const formatFunctionName = (name: string): string => `fun_${name}`;
