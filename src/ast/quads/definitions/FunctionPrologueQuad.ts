import { formatFunctionName } from './FunctionQuad.js';
import { GenericQuad } from './GenericQuad.js';
import { LabelQuad, Quad } from './index.js';

export class FunctionPrologueQuad extends Quad {
  private readonly entry: LabelQuad;

  public constructor(private readonly id: string) {
    super();

    this.entry = new LabelQuad(
      formatFunctionName(this.id),
      new GenericQuad({
        quad: `enter ${this.id}`,
        mips: 'nop',
      })
    );
  }

  public toString() {
    return this.entry.toString();
  }

  public toMips() {
    return [
      this.entry,
      'push $ra  # Save return address',
      'push $fp  # Save frame pointer',
      'move $fp, $sp  # Set new frame pointer',
    ];
  }
}
