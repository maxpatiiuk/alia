import type { RA } from '../../../utils/types.js';
import { formatFunctionName } from './FunctionQuad.js';
import { mipsSize, Quad } from './index.js';
import { SetArgQuad as SetArgumentQuad } from './SetArgQuad.js';
import { QuadsContext } from '../index.js';

export class CallQuad extends Quad {
  private readonly quads: RA<Quad>;
  private readonly tempsCount: number;

  public constructor(
    context: QuadsContext,
    actuals: RA<RA<Quad>>,
    private readonly name: string
  ) {
    super();
    const tempRegister = context.requestTempRegister();
    this.quads = actuals.flatMap((actual, index) => [
      ...actual,
      new SetArgumentQuad(
        index + 1,
        actual.at(-1)!.toValue(),
        actual.at(-1)!.toMipsValue(),
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
    return [
      `addi $sp, $fp, -${stackSize}  # BEGIN Calling ${this.name}`,
      ...this.quads.flatMap((quad) => quad.toMips()),
      `jal ${formatFunctionName(this.name)}  # END Calling ${this.name}`,
    ];
  }
}
