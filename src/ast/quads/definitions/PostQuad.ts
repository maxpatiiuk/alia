import type { QuadsContext } from '../index.js';
import { AssignQuad } from './AssignQuad.js';
import type { TempVariable } from './IdQuad.js';
import { Quad } from './index.js';
import { IntLiteralQuad } from './IntLiteralQuad.js';
import { LoadQuad } from './LoadQuad.js';
import { OpQuad } from './OperationQuad.js';
import { Register } from './Register.js';

export class PostQuad extends Quad {
  private readonly quad: AssignQuad;

  private readonly universalQuad: AssignQuad;

  private readonly intQuad: IntLiteralQuad;

  private readonly loadQuad: LoadQuad;

  public constructor(
    id: string,
    tempVariable: TempVariable,
    context: QuadsContext,
    type: '--' | '++'
  ) {
    super();
    const tempRegister = context.requestTempRegister();
    this.quad = new AssignQuad(id, tempVariable, [
      new OpQuad(new Register(id), type, new Register('1'), tempRegister),
    ]);

    const intRegister = context.requestTempRegister();
    this.intQuad = new IntLiteralQuad(1, intRegister, context.requestTemp());
    this.loadQuad = new LoadQuad(tempRegister, tempVariable);
    this.universalQuad = new AssignQuad(undefined, tempVariable, [
      new OpQuad(this.loadQuad, type, intRegister, tempRegister),
    ]);
  }

  public toString() {
    return this.quad.toString();
  }

  public toMips() {
    return [
      ...this.intQuad.toMips(),
      ...this.loadQuad.toMips(),
      ...this.universalQuad.toMips(),
    ];
  }

  public toAmd() {
    return [
      ...this.intQuad.toAmd(),
      ...this.loadQuad.toAmd(),
      ...this.universalQuad.toAmd(),
    ];
  }
}
