import { addComment, mem, Quad } from './index.js';
import { reg } from './IdQuad.js';

export class MayhemQuad extends Quad {
  public constructor(private readonly tempVariable: string | number) {
    super();
  }

  public toString() {
    return [`MAYHEM ${mem(this.tempVariable)}`];
  }

  public toValue() {
    return mem(this.tempVariable);
  }

  public toMips() {
    return addComment(
      [
        'addi $v0, $zero, 41',
        'move $a0, $zero',
        'syscall',
        `sw $a0, ${reg(this.tempVariable)} # END Mayhem`,
      ],
      'BEGIN Mayhem'
    );
  }

  public toMipsValue() {
    return reg(this.tempVariable);
  }
}
