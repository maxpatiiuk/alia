import type { RA } from '../../../utils/types.js';
import {
  addComment,
  amdSize,
  mipsSize,
  Quad,
  quadsToAmd,
  quadsToMips,
} from './index.js';
import { SetArgQuad as SetArgumentQuad } from './SetArgQuad.js';
import { QuadsContext } from '../index.js';
import { formatGlobalVariable } from './GlobalVarQuad.js';
import { getPcHelper } from './GlobalQuad.js';
import { TempVariable } from './IdQuad.js';
import { Register } from './Register.js';

export class CallQuad extends Quad {
  private readonly quads: RA<Quad>;
  private readonly tempsCount: number;

  public constructor(
    context: QuadsContext,
    actuals: RA<RA<Quad>>,
    private readonly name: string,
    private readonly dynamicTempVariable: TempVariable | undefined
  ) {
    super();
    const tempRegister = context.requestTempRegister();
    this.quads = actuals.flatMap((actual, index) => [
      ...(actual ?? []),
      new SetArgumentQuad(
        index + 1,
        actual?.at(-1)!.toValue(),
        actual === undefined
          ? undefined
          : new Register(
              actual.at(-1)!.toMipsValue(),
              actual.at(-1)!.toAmdValue()
            ),
        tempRegister,
        context.requestTemp()
      ),
    ]);
    this.tempsCount = context.getTempCount();
  }

  public toString() {
    return [
      ...this.quads.flatMap((quad) => quad.toString()),
      `call ${this.name}`,
    ];
  }

  public toMips() {
    const stackSize = this.tempsCount * mipsSize;
    return quadsToMips([
      ...this.quads,
      `addi $sp, $fp, -${stackSize}  # BEGIN Calling ${this.name}`,
      ...(this.dynamicTempVariable === undefined
        ? [`jal ${formatGlobalVariable(this.name)}`]
        : addComment(
            [
              `jal ${getPcHelper}`,
              'move $ra, $v0',
              `addi $ra, $ra, ${4 * mipsSize}  # Offset the return position`,
              `lw $v0, ${this.dynamicTempVariable.toMipsValue()}`,
              'jr $v0',
            ],
            'Calling function by pointer'
          )),
      `addi $sp, $fp, ${stackSize}  # END Calling ${this.name}`,
    ]);
  }

  public toAmd() {
    const stackSize = this.tempsCount * amdSize;
    return quadsToAmd([
      ...this.quads,
      `addq $${stackSize}, %rsp  # BEGIN Calling ${this.name}`,
      ...(this.dynamicTempVariable === undefined
        ? [`callq ${formatGlobalVariable(this.name)}`]
        : addComment(
            [
              `movq $${this.dynamicTempVariable.toAmdValue()}, %rax`,
              `callq rax`,
            ],
            'Calling function by pointer'
          )),
      `subq $${stackSize}, %rsp  # END Calling ${this.name}`,
    ]);
  }
}
