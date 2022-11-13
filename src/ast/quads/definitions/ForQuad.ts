import { RA } from '../../../utils/types.js';
import { NopQuad } from './NopQuad.js';
import { IfQuad } from './IfQuad.js';
import { GoToQuad } from './GoToQuad.js';
import { LabelQuad, Quad, quadsToMips, quadsToString } from './index.js';
import { QuadsContext } from '../index.js';

export class ForQuad extends Quad {
  private readonly quads: RA<Quad>;

  public constructor(
    private readonly declaration: RA<Quad>,
    private readonly condition: RA<Quad>,
    private readonly statements: RA<Quad>,
    context: QuadsContext
  ) {
    super();
    const startLabel = context.requestLabel();
    this.quads = [
      ...this.declaration,
      new LabelQuad(startLabel, new NopQuad()),
      new IfQuad(
        this.condition,
        [...this.statements, new GoToQuad(startLabel)],
        undefined,
        context
      ),
    ];
  }

  public toString() {
    return quadsToString(this.quads);
  }

  public toMips(): RA<LabelQuad | string> {
    return quadsToMips(this.quads);
  }
}
