import type { QuadsContext } from '../index.js';
import { AssignQuad } from './AssignQuad.js';
import { amdSize, mipsSize, Quad } from './index.js';
import { formatFunctionName, formatGlobalVariable } from './GlobalVarQuad.js';
import { Register } from './Register.js';
import { mainFunction } from './GlobalQuad.js';
import { PushQ } from '../../../instructions/amd/PushQ.js';
import { MovQ } from '../../../instructions/amd/MovQ.js';
import { SubQ } from '../../../instructions/amd/SubQ.js';
import { NextComment } from '../../../instructions/NextComment.js';
import { PrevComment } from '../../../instructions/PrevComment.js';
import { Sw } from '../../../instructions/mips/Sw.js';
import { Move } from '../../../instructions/mips/Move.js';
import { Label } from '../../../instructions/Label.js';

export class FunctionPrologueQuad extends Quad {
  private readonly entryQuad: Label;
  private readonly entryMips: Label;
  private readonly entryAmd: Label;

  private readonly setRa: Quad;

  public constructor(private readonly id: string, context: QuadsContext) {
    super();

    this.entryQuad = new Label(formatFunctionName(this.id));
    this.entryMips = new Label(formatGlobalVariable(this.id));
    this.entryAmd = new Label(
      this.id === mainFunction ? mainFunction : formatGlobalVariable(this.id)
    );

    // Allocate stack space for the function pointer
    context.requestTemp();
    this.setRa = new AssignQuad(undefined, context.requestTemp(), [
      new Register('$ra'),
    ]);
  }

  public toString() {
    return [this.entryQuad, `enter ${this.id}`];
  }

  public toMips() {
    return [
      this.entryMips,
      new NextComment('Save frame pointer'),
      new Sw('$fp', `-${mipsSize}($sp)`),
      new NextComment('Set new frame pointer'),
      new Move('$fp', '$sp'),
      new NextComment('Save return address'),
      ...this.setRa.toMips(),
      new PrevComment('Function body:'),
    ];
  }

  public toAmd() {
    return [
      this.entryAmd,
      new PushQ('%rbp'),
      new MovQ('%rsp', '%rbp'),
      new SubQ(`$${amdSize * 2}`, '%rsp'),
      new PrevComment('Function body:'),
    ];
  }
}
