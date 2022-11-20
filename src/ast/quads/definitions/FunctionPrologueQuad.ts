import type { QuadsContext } from '../index.js';
import { AssignQuad } from './AssignQuad.js';
import { UniversalQuad } from './UniversalQuad.js';
import { addComment, amdSize, LabelQuad, mipsSize, Quad } from './index.js';
import { formatFunctionName, formatGlobalVariable } from './GlobalVarQuad.js';
import { Register } from './Register.js';

export class FunctionPrologueQuad extends Quad {
  private readonly quadEntry: LabelQuad;
  private readonly universalEntry: LabelQuad;

  private readonly setRa: Quad;

  public constructor(private readonly id: string, context: QuadsContext) {
    super();

    this.quadEntry = new LabelQuad(
      formatFunctionName(this.id),
      new UniversalQuad({
        quad: `enter ${this.id}`,
      })
    );
    this.universalEntry = new LabelQuad(
      formatGlobalVariable(this.id),
      new UniversalQuad('nop')
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
      this.universalEntry,
      `sw $fp, -${mipsSize}($sp) # Save frame pointer`,
      `move $fp, $sp  # Set new frame pointer`,
      ...addComment(this.setRa.toMips(), 'Save return address'),
      '# Function body:',
    ];
  }

  public toAmd() {
    return [
      this.universalEntry,
      'pushq %rbp',
      'movq %rsp, %rbp',
      `addq $${amdSize * 2}, %rbp`,
      '# Function body:',
    ];
  }
}
