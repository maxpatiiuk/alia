import { Quad } from './index.js';
import { QuadGlobal } from '../../../instructions/definitions/amd/QuadGlobal.js';
import { WordGlobal } from '../../../instructions/definitions/mips/WordGlobal.js';
import { Label } from '../../../instructions/definitions/Label.js';

export class GlobalVarQuad extends Quad {
  private readonly name: string;

  private readonly labelQuad: Label | undefined;

  public constructor(
    private readonly id: string,
    private readonly value: number | undefined
  ) {
    super();

    this.name = formatGlobalVariable(this.id);
    this.labelQuad =
      typeof this.value === 'number' ? new Label(this.name) : undefined;
  }

  public toString() {
    return [this.id];
  }

  public toMips() {
    return this.labelQuad === undefined || this.value === undefined
      ? []
      : [this.labelQuad, new WordGlobal(this.value)];
  }

  public toAmd() {
    return this.labelQuad === undefined || this.value === undefined
      ? []
      : [this.labelQuad, new QuadGlobal(this.value)];
  }
}

export const formatGlobalVariable = (name: string): string => `global_${name}`;
export const formatFunctionName = (name: string): string => `fun_${name}`;
