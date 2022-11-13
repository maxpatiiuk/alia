import { AssignQuad } from './AssignQuad.js';
import { mem, Quad } from './index.js';
import { OpQuad } from './OperationQuad.js';
import { reg } from './IdQuad.js';
import { IntLiteralQuad } from './IntLiteralQuad.js';
import { QuadsContext } from '../index.js';

export class PostQuad extends Quad {
  private readonly quad: AssignQuad;
  private readonly mipsQuad: AssignQuad;

  public constructor(
    id: string,
    tempVariable: string | number,
    context: QuadsContext,
    type: '--' | '++'
  ) {
    super();
    const tempRegister = context.requestTempRegister();
    const secondTempRegister = context.requestTempRegister();
    this.quad = new AssignQuad(id, tempVariable, [
      new OpQuad(mem(id), type, '1', tempRegister),
    ]);
    this.mipsQuad = new AssignQuad(undefined, tempVariable, [
      new OpQuad(
        reg(tempVariable),
        type,
        new IntLiteralQuad('1', secondTempRegister).toMips()[0],
        tempRegister
      ),
    ]);
  }

  public toString() {
    return this.quad.toString();
  }

  public toMips() {
    return this.mipsQuad.toMips();
  }
}
