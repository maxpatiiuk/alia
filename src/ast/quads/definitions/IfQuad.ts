import type { RA } from '../../../utils/types.js';
import { GenericQuad, MipsQuad } from './GenericQuad.js';
import { GoToQuad } from './GoToQuad.js';
import {
  addComment,
  LabelQuad,
  Quad,
  quadsToMips,
  quadsToString,
} from './index.js';
import { NopQuad } from './NopQuad.js';
import { QuadsContext } from '../index.js';
import { LoadQuad } from './LoadQuad.js';

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
        this.condition.at(-1)!.toMipsValue(),
        context.requestTempRegister(),
        falseCase?.label ?? this.label
      ),
      new MipsQuad('# True Branch'),
      ...this.trueQuads,
      ...(typeof falseCase === 'object'
        ? [
            new GoToQuad(this.label),
            new MipsQuad('# False Branch'),
            new LabelQuad(falseCase.label, new NopQuad()),
            ...falseCase.quads,
          ]
        : []),
      new LabelQuad(
        this.label,
        new GenericQuad({
          quad: 'nop',
          mips: 'nop  # END if',
        })
      ),
    ];
  }

  public toString() {
    return quadsToString(this.quads);
  }

  public toMips() {
    return addComment(quadsToMips(this.quads), 'BEGIN if');
  }
}

class IfzQuad extends Quad {
  private readonly loadQuad: LoadQuad;
  public constructor(
    private readonly condition: string,
    mipsCondition: string,
    tempRegister: string,
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
}
