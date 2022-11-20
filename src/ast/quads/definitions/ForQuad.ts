import type { RA } from '../../../utils/types.js';
import type { QuadsContext } from '../index.js';
import { GoToQuad } from './GoToQuad.js';
import { IfQuad } from './IfQuad.js';
import {
  LabelQuad,
  Quad,
  quadsToAmd,
  quadsToMips,
  quadsToString,
} from './index.js';

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
      new LabelQuad(startLabel),
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

  public toAmd(): RA<LabelQuad | string> {
    return quadsToAmd(this.quads);
  }
}
