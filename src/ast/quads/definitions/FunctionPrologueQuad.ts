import type { QuadsContext } from '../index.js';
import { AssignQuad } from './AssignQuad.js';
import { addComment, amdSize, LabelQuad, mipsSize, Quad } from './index.js';
import { formatFunctionName, formatGlobalVariable } from './GlobalVarQuad.js';
import { Register } from './Register.js';
import { mainFunction } from './GlobalQuad.js';

export class FunctionPrologueQuad extends Quad {
  private readonly entryQuad: LabelQuad;
  private readonly entryMips: LabelQuad;
  private readonly entryAmd: LabelQuad;

  private readonly setRa: Quad;

  public constructor(private readonly id: string, context: QuadsContext) {
    super();

    this.entryQuad = new LabelQuad(formatFunctionName(this.id));
    this.entryMips = new LabelQuad(formatGlobalVariable(this.id));
    this.entryAmd = new LabelQuad(
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
      `sw $fp, -${mipsSize}($sp) # Save frame pointer`,
      `move $fp, $sp  # Set new frame pointer`,
      ...addComment(this.setRa.toMips(), 'Save return address'),
      '# Function body:',
    ];
  }

  public toAmd() {
    return [
      this.entryAmd,
      'pushq %rbp',
      'movq %rsp, %rbp',
      `subq $${amdSize * 2}, %rsp`,
      '# Function body:',
    ];
  }
}
