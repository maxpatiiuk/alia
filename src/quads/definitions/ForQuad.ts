import type { RA } from '../../utils/types.js';
import type { QuadsContext } from '../index.js';
import { GoToQuad } from './GoToQuad.js';
import { IfQuad } from './IfQuad.js';
import { Quad, quadsToAmd, quadsToMips, quadsToString } from './index.js';
import { Label } from '../../instructions/definitions/Label.js';

export class ForQuad extends Quad {
  private readonly instructions: RA<Quad | Label>;

  public constructor(
    private readonly declaration: RA<Quad>,
    private readonly condition: RA<Quad>,
    private readonly statements: RA<Quad>,
    context: QuadsContext
  ) {
    super();
    const startLabel = context.requestLabel();
    this.instructions = [
      ...this.declaration,
      new Label(startLabel),
      new IfQuad(
        this.condition,
        [...this.statements, new GoToQuad(startLabel)],
        undefined,
        context
      ),
    ];
  }

  public toString() {
    return quadsToString(this.instructions);
  }

  public toMips() {
    return quadsToMips(this.instructions);
  }

  public toAmd() {
    return quadsToAmd(this.instructions);
  }
}
