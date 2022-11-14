import type { QuadsContext } from '../index.js';
import { AssignQuad } from './AssignQuad.js';
import { GenericQuad, MipsQuad } from './GenericQuad.js';
import { Register } from './GetArgQuad.js';
import { addComment, LabelQuad, mipsSize, Quad } from './index.js';
import { formatFunctionName, formatGlobalVariable } from './GlobalVarQuad.js';

export class FunctionPrologueQuad extends Quad {
  private readonly quadEntry: LabelQuad;
  private readonly mipsEntry: LabelQuad;

  private readonly setRa: Quad;

  public constructor(private readonly id: string, context: QuadsContext) {
    super();

    this.quadEntry = new LabelQuad(
      formatFunctionName(this.id),
      new GenericQuad({
        quad: `enter ${this.id}`,
      })
    );
    this.mipsEntry = new LabelQuad(
      formatGlobalVariable(this.id),
      new MipsQuad('nop')
    );

    // Allocate stack space for the function pointer
    context.requestTemp();
    this.setRa = new AssignQuad(undefined, context.requestTemp(), [
      new Register('$ra'),
    ]);
  }

  public toString() {
    return this.quadEntry.toString();
  }

  public toMips() {
    return [
      this.mipsEntry,
      `sw $fp, -${mipsSize}($sp) # Save frame pointer`,
      `move $fp, $sp  # Set new frame pointer`,
      ...addComment(this.setRa.toMips(), 'Save return address'),
      '# Function body:',
    ];
  }
}
