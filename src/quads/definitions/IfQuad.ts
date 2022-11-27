import type { RA } from '../../utils/types.js';
import { GoToQuad } from './GoToQuad.js';
import { Quad, quadsToAmd, quadsToMips, quadsToString } from './index.js';
import { QuadsContext } from '../index.js';
import { LoadQuad } from './LoadQuad.js';
import { Register } from './Register.js';
import { NextComment } from '../../instructions/definitions/NextComment.js';
import { PrevComment } from '../../instructions/definitions/PrevComment.js';
import { Jz } from '../../instructions/definitions/amd/Jz.js';
import { Beq } from '../../instructions/definitions/mips/Beq.js';
import { Label } from '../../instructions/definitions/Label.js';
import { OpQuad } from './OperationQuad.js';
import { MovQ } from '../../instructions/definitions/amd/MovQ.js';

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
      new NextComment('BEGIN If Condition'),
      new IfzQuad(
        this.condition,
        context.requestTempRegister(),
        falseCase?.label ?? this.label
      ),
      new PrevComment('END If Condition'),
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
    private readonly condition: RA<Quad>,
    tempRegister: Register,
    private readonly label: string
  ) {
    super();
    this.loadQuad = new LoadQuad(
      tempRegister,
      new Register(
        this.condition.at(-1)!.toMipsValue(),
        this.condition.at(-1)!.toAmdValue()
      )
    );
  }

  public toString() {
    return [`IFZ ${this.condition.at(-1)!.toValue()} GOTO ${this.label}`];
  }

  public toMips() {
    return quadsToMips([
      ...this.condition,
      this.loadQuad,
      new Beq('$zero', this.loadQuad.toMipsValue(), this.label),
    ]);
  }

  public toAmd() {
    return quadsToAmd([
      ...this.condition,
      this.loadQuad,
      new MovQ('$0', '%rax'),
      new OpQuad(
        this.loadQuad,
        '==',
        new Register('%rax'),
        new Register('%rax')
      ),
      new Jz(this.label),
    ]);
  }
}
