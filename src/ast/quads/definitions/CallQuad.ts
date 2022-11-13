import type { RA } from '../../../utils/types.js';
import { formatFunctionName } from './FunctionQuad.js';
import { mipsSize, Quad, quadsToMips } from './index.js';
import { SetArgQuad as SetArgumentQuad } from './SetArgQuad.js';
import { QuadsContext } from '../index.js';
import { Register } from './GetArgQuad.js';

export class CallQuad extends Quad {
  private readonly quads: RA<Quad>;
  private readonly tempsCount: number;

  public constructor(
    context: QuadsContext,
    actuals: RA<RA<Quad> | undefined>,
    private readonly name: string
  ) {
    super();
    const tempRegister = context.requestTempRegister();
    this.quads = actuals.flatMap((actual, index) => [
      ...(actual ?? []),
      new SetArgumentQuad(
        index + 1,
        actual?.at(-1)!.toValue() ?? '0',
        actual?.at(-1)!.toMipsValue() ?? new Register('$zero'),
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
      `jal ${formatFunctionName(this.name)}  # END Calling ${this.name}`,
    ]);
  }
}
