import { DecQ } from '../../instructions/definitions/amd/DecQ.js';
import { IncQ } from '../../instructions/definitions/amd/IncQ.js';
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

  private readonly intQuad: IntLiteralQuad;

  private readonly loadQuad: LoadQuad;

  private readonly mipsQuad: AssignQuad;

  private readonly amdOp: DecQ | IncQ;

  private readonly amdQuad: AssignQuad;

  public constructor(
    private readonly id: string,
    tempVariable: TempVariable,
    context: QuadsContext,
    type: '--' | '++'
  ) {
    super();
    const tempRegister = context.requestTempRegister();
    this.quad = new AssignQuad(this.id, tempVariable, [
      new OpQuad(new Register(this.id), type, new Register('1'), tempRegister),
    ]);

    const intRegister = context.requestTempRegister();
    this.intQuad = new IntLiteralQuad(1, intRegister, context.requestTemp());
    this.loadQuad = new LoadQuad(tempRegister, tempVariable);
    this.mipsQuad = new AssignQuad(undefined, tempVariable, [
      new OpQuad(this.loadQuad, type, intRegister, tempRegister),
    ]);

    this.amdOp = new (type === '--' ? DecQ : IncQ)(tempRegister.toAmdValue());
    this.amdQuad = new AssignQuad(undefined, tempVariable, [tempRegister]);
  }

  public toString() {
    return this.quad.toString();
  }

  public toValue() {
    return this.id;
  }

  public toMips() {
    return [
      ...this.intQuad.toMips(),
      ...this.loadQuad.toMips(),
      ...this.mipsQuad.toMips(),
    ];
  }

  public toMipsValue(): string {
    return this.mipsQuad.toMipsValue();
  }

  public toAmd() {
    return [...this.loadQuad.toAmd(), this.amdOp, ...this.amdQuad.toAmd()];
  }

  public toAmdValue() {
    return this.amdQuad.toAmdValue();
  }
}
