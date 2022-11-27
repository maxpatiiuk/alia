import type { RA } from '../../../utils/types.js';
import type { TempVariable } from './IdQuad.js';
import { Quad } from './index.js';
import { mem } from './IdQuad.js';
import { MovQ } from '../../../instructions/definitions/amd/MovQ.js';
import { NextComment } from '../../../instructions/definitions/NextComment.js';
import { PrevComment } from '../../../instructions/definitions/PrevComment.js';
import { Sw } from '../../../instructions/definitions/mips/Sw.js';

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
    return [
      ...(typeof this.id === 'string'
        ? [new NextComment(`BEGIN Assigning ${this.id}`)]
        : []),
      ...this.expression.flatMap((quad) => quad.toMips()),
      new Sw(
        this.expression.at(-1)!.toMipsValue(),
        this.tempVariable.toMipsValue()
      ),
      ...(typeof this.id === 'string'
        ? [new PrevComment(`END Assigning ${this.id}`)]
        : []),
    ];
  }

  public toMipsValue() {
    return this.tempVariable.toMipsValue();
  }

  public toAmd() {
    return [
      ...(typeof this.id === 'string'
        ? [new NextComment(`BEGIN Assigning ${this.id}`)]
        : []),
      ...this.expression.flatMap((quad) => quad.toAmd()),
      new MovQ(
        this.expression.at(-1)!.toAmdValue(),
        this.tempVariable.toAmdValue()
      ),
      ...(typeof this.id === 'string'
        ? [new PrevComment(`END Assigning ${this.id}`)]
        : []),
    ];
  }

  public toAmdValue() {
    return this.tempVariable.toAmdValue();
  }
}
