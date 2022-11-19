import type { QuadsContext } from '../index.js';
import { AssignQuad } from './AssignQuad.js';
import { TempVariable } from './IdQuad.js';
import { mem, Quad } from './index.js';
import { IntLiteralQuad } from './IntLiteralQuad.js';
import { OpQuad } from './OperationQuad.js';
import { LoadQuad } from './LoadQuad.js';

export class PostQuad extends Quad {
  private readonly quad: AssignQuad;

  private readonly mipsQuad: AssignQuad;

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
      new OpQuad(mem(id), type, '1', tempRegister),
    ]);

    const intRegister = context.requestTempRegister();
    this.intQuad = new IntLiteralQuad('1', intRegister, context.requestTemp());
    this.loadQuad = new LoadQuad(tempRegister, tempVariable);
    this.mipsQuad = new AssignQuad(undefined, tempVariable, [
      new OpQuad(
        this.loadQuad.toMipsValue(),
        type,
        intRegister.toMipsValue(),
        tempRegister
      ),
    ]);
  }

  public toString() {
    return this.quad.toString();
  }

  public toMips() {
    return [
      ...this.intQuad.toMips(),
      ...this.loadQuad.toMips(),
      ...this.mipsQuad.toMips(),
    ];
  }
}
