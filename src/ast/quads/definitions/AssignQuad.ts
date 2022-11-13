import type { RA } from '../../../utils/types.js';
import { mem, Quad } from './index.js';
import { reg } from './IdQuad.js';

export class AssignQuad extends Quad {
  public constructor(
    public readonly id: string | undefined,
    private readonly tempVariable: string | number,
    private readonly expression: RA<Quad>
  ) {
    super();
  }

  public toString() {
    return [
      ...this.expression.flatMap((quad) => quad.toString()),
      `${mem(this.id ?? this.tempVariable)} := ${this.expression
        .at(-1)!
        .toValue()}`,
    ];
  }

  public toValue(): string {
    return mem(this.id ?? this.tempVariable);
  }

  public toMips() {
    return [
      ...(typeof this.id === 'string' ? [`# Assign ${this.id} START`] : []),
      ...this.expression.flatMap((quad) => quad.toMips()),
      `sw ${this.expression.at(-1)!.toMipsValue()}, ${reg(this.tempVariable)}`,
      ...(typeof this.id === 'string' ? [`# Assign ${this.id} END`] : []),
    ];
  }

  public toMipsValue() {
    return reg(this.tempVariable);
  }
}
