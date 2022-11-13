import { formatFunctionName } from './FunctionQuad.js';
import { GenericQuad } from './GenericQuad.js';
import { LabelQuad, Quad } from './index.js';
import { PushQuad } from './PushQuad.js';

export class FunctionPrologueQuad extends Quad {
  private readonly entry: LabelQuad;
  private readonly pushRa: Quad;
  private readonly pushFp: Quad;

  public constructor(private readonly id: string) {
    super();

    this.entry = new LabelQuad(
      formatFunctionName(this.id),
      new GenericQuad({
        quad: `enter ${this.id}`,
        mips: 'nop',
      })
    );

    this.pushRa = new PushQuad('$ra', 'Save return address');
    this.pushFp = new PushQuad('$fp', 'Save frame pointer');
  }

  public toString() {
    return this.entry.toString();
  }

  public toMips() {
    return [
      this.entry,
      ...this.pushRa.toMips(),
      ...this.pushFp.toMips(),
      'move $fp, $sp  # Set new frame pointer',
      '# Function body:',
    ];
  }
}
