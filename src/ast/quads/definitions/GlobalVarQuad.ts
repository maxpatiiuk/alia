import { LabelQuad, Quad } from './index.js';
import { MipsQuad } from './GenericQuad.js';

export class GlobalVarQuad extends Quad {
  private readonly name: string;
  private readonly mipsQuad: Quad | undefined;

  public constructor(id: string, private readonly value: number | undefined) {
    super();

    this.name = formatGlobalVariable(id);
    this.mipsQuad =
      typeof this.value === 'number'
        ? new LabelQuad(this.name, new MipsQuad(`.word ${this.value}`))
        : undefined;
  }

  public toString() {
    return [this.name];
  }

  public toMips() {
    return this.mipsQuad === undefined ? [] : this.mipsQuad.toMips();
  }
}

export const formatGlobalVariable = (name: string): string => `global_${name}`;
