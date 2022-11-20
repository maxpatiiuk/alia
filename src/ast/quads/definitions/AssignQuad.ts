import type { RA } from '../../../utils/types.js';
import type { TempVariable } from './IdQuad.js';
import { addComment, Quad } from './index.js';
import { mem } from './IdQuad.js';

export class AssignQuad extends Quad {
  private readonly tempValue: string;

  public constructor(
    public readonly id: string | undefined,
    private readonly tempVariable: TempVariable,
    private readonly expression: RA<Quad>
  ) {
    super();
    this.tempValue =
      typeof this.id === 'string' ? mem(this.id) : this.tempVariable.toValue();
  }

  public toString() {
    return [
      ...this.expression.flatMap((quad) => quad.toString()),
      `${this.tempValue} := ${this.expression.at(-1)!.toValue()}`,
    ];
  }

  public toValue(): string {
    return this.tempValue;
  }

  public toMips() {
    const mips = [
      ...this.expression.flatMap((quad) => quad.toMips()),
      `sw ${this.expression
        .at(-1)!
        .toMipsValue()}, ${this.tempVariable.toMipsValue()}`,
      ...(typeof this.id === 'string' ? [`# END Assigning ${this.id}`] : []),
    ];
    return typeof this.id === 'string'
      ? addComment(mips, `BEGIN Assigning ${this.id}`)
      : mips;
  }

  public toMipsValue() {
    return this.tempVariable.toMipsValue();
  }

  public toAmd() {
    const amd = [
      ...this.expression.flatMap((quad) => quad.toAmd()),
      `movq ${this.expression
        .at(-1)!
        .toAmdValue()}, ${this.tempVariable.toAmdValue()}`,
      ...(typeof this.id === 'string' ? [`# END Assigning ${this.id}`] : []),
    ];
    return typeof this.id === 'string'
      ? addComment(amd, `BEGIN Assigning ${this.id}`)
      : amd;
  }

  public toAmdValue() {
    return this.tempVariable.toAmdValue();
  }
}
