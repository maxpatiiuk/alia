import { RA } from '../../../utils/types.js';
import { NopQuad } from './NopQuad.js';
import { IfQuad } from './IfQuad.js';
import { GoToQuad } from './GoToQuad.js';
import { LabelQuad, Quad, quadsToString } from './index.js';

export class ForQuad extends Quad {
  private readonly quads: RA<Quad>;

  public constructor(
    private readonly declaration: RA<Quad>,
    private readonly condition: RA<Quad>,
    private readonly statements: RA<Quad>,
    private readonly startLabel: string,
    private readonly endLabel: string
  ) {
    super();
    this.quads = [
      ...this.declaration,
      new LabelQuad(this.startLabel, new NopQuad()),
      new IfQuad(
        this.condition,
        [...this.statements, new GoToQuad(this.startLabel)],
        undefined,
        this.endLabel
      ),
    ];
  }

  public toString() {
    return quadsToString(this.quads);
  }
}
