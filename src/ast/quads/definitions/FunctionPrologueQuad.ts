import type { QuadsContext } from '../index.js';
import { AssignQuad } from './AssignQuad.js';
import { addComment, amdSize, LabelQuad, mipsSize, Quad } from './index.js';
import { formatFunctionName } from './GlobalVarQuad.js';
import { Register } from './Register.js';

export class FunctionPrologueQuad extends Quad {
  private readonly entry: LabelQuad;

  private readonly setRa: Quad;

  public constructor(private readonly id: string, context: QuadsContext) {
    super();

    this.entry = new LabelQuad(formatFunctionName(this.id));

    // Allocate stack space for the function pointer
    context.requestTemp();
    this.setRa = new AssignQuad(undefined, context.requestTemp(), [
      new Register('$ra'),
    ]);
  }

  public toString() {
    return [this.entry, `enter ${this.id}`];
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

  public toAmd() {
    return [
      this.entry,
      'pushq %rbp',
      'movq %rsp, %rbp',
      `addq $${amdSize * 2}, %rbp`,
      '# Function body:',
    ];
  }
}
