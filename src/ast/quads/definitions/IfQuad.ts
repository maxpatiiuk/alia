import type { RA } from '../../../utils/types.js';
import { GoToQuad } from './GoToQuad.js';
import { Quad, quadsToAmd, quadsToMips, quadsToString } from './index.js';
import { QuadsContext } from '../index.js';
import { LoadQuad } from './LoadQuad.js';
import { Register } from './Register.js';
import { NextComment } from '../../../instructions/NextComment.js';
import { PrevComment } from '../../../instructions/PrevComment.js';
import { Jz } from '../../../instructions/amd/Jz.js';
import { Beq } from '../../../instructions/mips/Beq.js';
import { Label } from '../../../instructions/Label.js';

export class IfQuad extends Quad {
  private readonly quads: RA<Quad | NextComment | PrevComment | Label>;
  private readonly label: string;

  public constructor(
    private readonly condition: RA<Quad>,
    private readonly trueQuads: RA<Quad>,
    falseCase: { readonly quads: RA<Quad>; readonly label: string } | undefined,
    context: QuadsContext
  ) {
    super();
    this.label = context.requestLabel();

    this.quads = [
      ...this.condition,
      new IfzQuad(
        this.condition.at(-1)!.toValue(),
        new Register(
          this.condition.at(-1)!.toMipsValue(),
          this.condition.at(-1)!.toAmdValue()
        ),
        context.requestTempRegister(),
        falseCase?.label ?? this.label
      ),
      new NextComment('BEGIN True Branch'),
      ...this.trueQuads,
      new PrevComment('END True Branch'),
      ...(typeof falseCase === 'object'
        ? [
            new GoToQuad(this.label),
            new NextComment('BEGIN False Branch'),
            new Label(falseCase.label),
            ...falseCase.quads,
            new PrevComment('END False Branch'),
          ]
        : []),
      new Label(this.label),
    ];
  }

  public toString() {
    return quadsToString(this.quads);
  }

  public toMips() {
    return [
      new NextComment('BEGIN if'),
      ...quadsToMips(this.quads),
      new PrevComment('END if'),
    ];
  }

  public toAmd() {
    return [
      new NextComment('BEGIN if'),
      ...quadsToAmd(this.quads),
      new PrevComment('END if'),
    ];
  }
}

class IfzQuad extends Quad {
  private readonly loadQuad: LoadQuad;

  public constructor(
    private readonly condition: string,
    mipsCondition: Register,
    tempRegister: Register,
    private readonly label: string
  ) {
    super();
    this.loadQuad = new LoadQuad(tempRegister, mipsCondition);
  }

  public toString() {
    return [`IFZ ${this.condition} GOTO ${this.label}`];
  }

  public toMips() {
    return [
      ...this.loadQuad.toMips(),
      new Beq('$zero', this.loadQuad.toMipsValue(), this.label),
    ];
  }

  public toAmd() {
    return [
      ...this.loadQuad.toAmd(),
      new Jz(this.loadQuad.toAmdValue(), this.label),
    ];
  }
}
