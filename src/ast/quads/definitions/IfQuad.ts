import type { RA } from '../../../utils/types.js';
import { UniversalQuad } from './UniversalQuad.js';
import { GoToQuad } from './GoToQuad.js';
import {
  addComment,
  LabelQuad,
  Quad,
  quadsToAmd,
  quadsToMips,
  quadsToString,
} from './index.js';
import { QuadsContext } from '../index.js';
import { LoadQuad } from './LoadQuad.js';
import { Register } from './Register.js';

export class IfQuad extends Quad {
  private readonly quads: RA<Quad>;
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
      new UniversalQuad({
        mips: '# True Branch',
        amd: '# True Branch',
      }),
      ...this.trueQuads,
      ...(typeof falseCase === 'object'
        ? [
            new GoToQuad(this.label),
            new UniversalQuad({
              mips: '# False Branch',
              amd: '# False Branch',
            }),
            new LabelQuad(falseCase.label),
            ...falseCase.quads,
          ]
        : []),
      new LabelQuad(this.label),
    ];
  }

  public toString() {
    return quadsToString(this.quads);
  }

  public toMips() {
    return addComment(quadsToMips(this.quads), 'BEGIN if');
  }

  public toAmd() {
    return addComment(quadsToAmd(this.quads), 'BEGIN if');
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
      `beq $zero, ${this.loadQuad.toMipsValue()}, ${this.label}`,
    ];
  }

  public toAmd() {
    return [
      ...this.loadQuad.toAmd(),
      `jz ${this.loadQuad.toAmdValue()}, ${this.label}`,
    ];
  }
}
