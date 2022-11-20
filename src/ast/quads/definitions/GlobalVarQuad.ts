import { LabelQuad, Quad } from './index.js';

export class GlobalVarQuad extends Quad {
  private readonly name: string;

  private readonly labelQuad: LabelQuad | undefined;

  public constructor(
    private readonly id: string,
    private readonly value: number | undefined
  ) {
    super();

    this.name = formatGlobalVariable(this.id);
    this.labelQuad =
      typeof this.value === 'number' ? new LabelQuad(this.name) : undefined;
  }

  public toString() {
    return [this.id];
  }

  public toMips() {
    return this.labelQuad === undefined
      ? []
      : [this.labelQuad, `.word ${this.value}`];
  }

  public toAmd() {
    return this.labelQuad === undefined
      ? []
      : [this.labelQuad, `.quad ${this.value}`];
  }
}

export const formatGlobalVariable = (name: string): string => `global_${name}`;
export const formatFunctionName = (name: string): string => `fun_${name}`;
