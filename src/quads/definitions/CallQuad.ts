import type { RA } from '../../utils/types.js';
import { mipsSize, Quad, quadsToAmd, quadsToMips } from './index.js';
import { SetArgQuad as SetArgumentQuad } from './SetArgQuad.js';
import { QuadsContext } from '../index.js';
import { formatGlobalVariable } from './GlobalVarQuad.js';
import { getPcHelper } from './GlobalQuad.js';
import { TempVariable } from './IdQuad.js';
import { Register } from './Register.js';
import { NextComment } from '../../instructions/definitions/NextComment.js';
import { MovQ } from '../../instructions/definitions/amd/MovQ.js';
import { CallQ } from '../../instructions/definitions/amd/CallQ.js';
import { Addi } from '../../instructions/definitions/mips/Addi.js';
import { Jal } from '../../instructions/definitions/mips/Jal.js';
import { Move } from '../../instructions/definitions/mips/Move.js';
import { Lw } from '../../instructions/definitions/mips/Lw.js';
import { Jr } from '../../instructions/definitions/mips/Jr.js';
import { PrevComment } from '../../instructions/definitions/PrevComment.js';

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
      new NextComment(`BEGIN Calling ${this.name}`),
      new Addi('$sp', '$sp', -stackSize),
      ...(this.dynamicTempVariable === undefined
        ? [new Jal(formatGlobalVariable(this.name))]
        : [
            new NextComment('Calling function by pointer'),
            new Jal(getPcHelper),
            new Move('$ra', '$v0'),
            new NextComment('Offset the return position'),
            new Addi('$ra', '$ra', 4 * mipsSize),
            new Lw('$v0', this.dynamicTempVariable.toMipsValue()),
            new Jr('$v0'),
          ]),
      new Addi('$sp', '$sp', stackSize),
      new PrevComment(`END Calling ${this.name}`),
    ]);
  }

  public toAmd() {
    return quadsToAmd([
      ...this.quads,
      ...(this.dynamicTempVariable === undefined
        ? [new CallQ(formatGlobalVariable(this.name))]
        : [
            new NextComment('Calling function by pointer'),
            new MovQ(`$${this.dynamicTempVariable.toAmdValue()}`, '%rax'),
            new CallQ('rax'),
          ]),
    ]);
  }
}
