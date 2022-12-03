import type { RA } from '../../utils/types.js';
import { GoToQuad } from './GoToQuad.js';
import {
  LlvmContext,
  Quad,
  quadsToAmd,
  quadsToMips,
  quadsToString,
} from './index.js';
import { QuadsContext } from '../index.js';
import { LoadQuad } from './LoadQuad.js';
import { Register } from './Register.js';
import { NextComment } from '../../instructions/definitions/NextComment.js';
import { PrevComment } from '../../instructions/definitions/PrevComment.js';
import { Je } from '../../instructions/definitions/amd/Je.js';
import { Beq } from '../../instructions/definitions/mips/Beq.js';
import { Label } from '../../instructions/definitions/Label.js';
import { CmpQ } from '../../instructions/definitions/amd/CmpQ.js';
import llvm from 'llvm-bindings';

export class IfQuad extends Quad {
  private readonly quads: RA<Quad | NextComment | PrevComment | Label>;
  private readonly label: string;

  public constructor(
    private readonly condition: RA<Quad>,
    private readonly trueQuads: RA<Quad>,
    private readonly falseCase:
      | { readonly quads: RA<Quad>; readonly label: string }
      | undefined,
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

  public toLlvm(context: LlvmContext, loopBack: boolean = false) {
    const { builder, context: thisContext } = context;

    const rawCondition = this.condition
      .map((condition) => condition.toLlvm(context))
      .at(-1)!;

    const condition = builder.CreateIntCast(
      rawCondition,
      builder.getInt64Ty(),
      true
    );

    const boolCondition = builder.CreateICmpNE(
      condition,
      llvm.ConstantInt.get(builder.getInt64Ty(), 0, true),
      'ifcond'
    );

    const fn = builder.GetInsertBlock()!.getParent()!;

    const thenBlock = llvm.BasicBlock.Create(thisContext, 'then', fn);
    const elseBlock = llvm.BasicBlock.Create(thisContext, 'else');
    const mergeBlock = llvm.BasicBlock.Create(thisContext, 'ifcont');

    builder.CreateCondBr(boolCondition, thenBlock, elseBlock);

    builder.SetInsertPoint(thenBlock);
    this.trueQuads
      .filter((quad) => !(quad instanceof GoToQuad))
      .forEach((quad) => quad.toLlvm(context));
    builder.CreateBr(loopBack ? thenBlock : mergeBlock);

    fn.addBasicBlock(elseBlock);
    builder.SetInsertPoint(elseBlock);
    this.falseCase?.quads.forEach((quad) => quad.toLlvm(context));
    builder.CreateBr(mergeBlock);

    fn.addBasicBlock(mergeBlock);
    builder.SetInsertPoint(mergeBlock);

    return llvm.ConstantInt.get(builder.getInt64Ty(), 0, true);
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
      new CmpQ('$0', this.loadQuad.toAmdValue()),
      new Je(this.label),
    ]);
  }
}
