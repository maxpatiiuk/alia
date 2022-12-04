import type { RA } from '../../utils/types.js';
import type { TempVariable } from './IdQuad.js';
import { LlvmContext, Quad } from './index.js';
import { IdQuad, mem } from './IdQuad.js';
import { MovQ } from '../../instructions/definitions/amd/MovQ.js';
import { NextComment } from '../../instructions/definitions/NextComment.js';
import { PrevComment } from '../../instructions/definitions/PrevComment.js';
import { Sw } from '../../instructions/definitions/mips/Sw.js';
import { Register } from './Register.js';
import { LoadQuad } from './LoadQuad.js';
import { QuadsContext } from '../index.js';
import { IdNode } from '../../ast/definitions/term/IdNode.js';

export class AssignExpClass extends Quad {
  private readonly quads: RA<Quad>;

  public constructor(
    private readonly id: IdNode,
    private readonly expression: RA<Quad>,
    context: QuadsContext
  ) {
    super();
    const tempRegister = context.requestTempRegister();
    const lastQuad = this.expression.at(-1)!;
    const isFunction = lastQuad instanceof IdQuad && lastQuad.isFunction;
    const mipsValue = lastQuad.toMipsValue();
    const amdValue = lastQuad.toAmdValue();
    const register = new Register(mipsValue, amdValue) as TempVariable;
    this.quads = [
      ...this.expression,
      new LoadQuad(tempRegister, register, isFunction),
      new AssignQuad(this.id.getName(), this.id.getTempVariable(), [
        tempRegister,
      ]),
    ];
  }

  public toString() {
    return this.quads.flatMap((quad) => quad.toString());
  }

  public toValue() {
    return this.quads.at(-1)!.toValue();
  }

  public toMips() {
    return this.quads.flatMap((quad) => quad.toMips());
  }

  public toMipsValue() {
    return this.quads.at(-1)!.toMipsValue();
  }

  public toAmd() {
    return this.quads.flatMap((quad) => quad.toAmd());
  }

  public toAmdValue() {
    return this.quads.at(-1)!.toAmdValue();
  }

  public toLlvm(context: LlvmContext) {
    const value = this.expression.map((quad) => quad.toLlvm(context)).at(-1)!;
    const declaration = this.id.getDeclaration()!;
    return context.builder.CreateStore(value, declaration.llvmValue);
  }
}

export class AssignQuad extends Quad {
  private readonly tempValue: string;

  public constructor(
    public readonly id: string | undefined,
    private readonly tempVariable: TempVariable | Register,
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
