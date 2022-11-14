import type { QuadsContext } from '../index.js';
import { AssignQuad } from './AssignQuad.js';
import { GenericQuad } from './GenericQuad.js';
import { Register } from './GetArgQuad.js';
import { addComment, LabelQuad, mipsSize, Quad } from './index.js';
import { formatGlobalVariable } from './GlobalVarQuad.js';

export class FunctionPrologueQuad extends Quad {
  private readonly entry: LabelQuad;

  private readonly setRa: Quad;

  public constructor(private readonly id: string, context: QuadsContext) {
    super();

    this.entry = new LabelQuad(
      formatGlobalVariable(this.id),
      new GenericQuad({
        quad: `enter ${this.id}`,
        mips: 'nop',
      })
    );

    // Allocate stack space for the function pointer
    context.requestTemp();
    this.setRa = new AssignQuad(undefined, context.requestTemp(), [
      new Register('$ra'),
    ]);
  }

  public toString() {
    return this.entry.toString();
  }

  public toMips() {
    return [
      this.entry,
      `sw $fp, -${mipsSize}($sp) # Save frame pointer`,
      `move $fp, $sp  # Set new frame pointer`,
      ...addComment(this.setRa.toMips(), 'Save return address'),
      '# Function body:',
    ];
  }
}
