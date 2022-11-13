import type { RA } from '../../../utils/types.js';
import { GoToQuad } from './GoToQuad.js';
import { Quad, quadsToString } from './index.js';
import { LabelQuad } from './LabelQuad.js';
import { NopQuad } from './NopQuad.js';

export class IfQuad extends Quad {
  private readonly quads: RA<Quad>;

  public constructor(
    private readonly condition: RA<Quad>,
    private readonly trueQuads: RA<Quad>,
    falseCase: { readonly quads: RA<Quad>; readonly label: string } | undefined,
    private readonly label: string
  ) {
    super();
    this.quads = [
      ...this.condition,
      new IfzQuad(
        this.condition.at(-1)!.toValue(),
        falseCase?.label ?? this.label
      ),
      ...this.trueQuads,
      ...(typeof falseCase === 'object'
        ? [
            new GoToQuad(this.label),
            new LabelQuad(falseCase.label, new NopQuad()),
            ...falseCase.quads,
          ]
        : []),
      new LabelQuad(this.label, new NopQuad()),
    ];
  }

  public toString() {
    return quadsToString(this.quads);
  }
}

class IfzQuad extends Quad {
  public constructor(
    private readonly condition: string,
    private readonly label: string
  ) {
    super();
  }

  public toString() {
    return [`IFZ ${this.condition} GOTO ${this.label}`];
  }
}
