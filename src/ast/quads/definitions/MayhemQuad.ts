import { addComment, Quad } from './index.js';
import { TempVariable } from './IdQuad.js';

export class MayhemQuad extends Quad {
  public constructor(private readonly tempVariable: TempVariable) {
    super();
  }

  public toString() {
    return [`MAYHEM ${this.tempVariable.toValue()}`];
  }

  public toValue() {
    return this.tempVariable.toValue();
  }

  public toMips() {
    return addComment(
      [
        'addi $v0, $zero, 41',
        'move $a0, $zero',
        'syscall',
        `sw $a0, ${this.tempVariable.toMipsValue()} # END Mayhem`,
      ],
      'BEGIN Mayhem'
    );
  }

  public toMipsValue() {
    return this.tempVariable.toMipsValue();
  }
}
