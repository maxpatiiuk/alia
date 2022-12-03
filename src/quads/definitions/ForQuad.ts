import type { RA } from '../../utils/types.js';
import type { QuadsContext } from '../index.js';
import { GoToQuad } from './GoToQuad.js';
import { IfQuad } from './IfQuad.js';
import {
  LlvmContext,
  Quad,
  quadsToAmd,
  quadsToMips,
  quadsToString,
} from './index.js';
import { Label } from '../../instructions/definitions/Label.js';
import { PrevComment } from '../../instructions/definitions/PrevComment.js';
import { NextComment } from '../../instructions/definitions/NextComment.js';
import llvm from 'llvm-bindings';

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
    return [
      new NextComment('BEGIN for loop'),
      ...quadsToMips(this.instructions),
      new PrevComment('END for loop'),
    ];
  }

  public toAmd() {
    return [
      new NextComment('BEGIN for loop'),
      ...quadsToAmd(this.instructions),
      new PrevComment('END for loop'),
    ];
  }

  public toLlvm(context: LlvmContext) {
    // FIXME: refacto t oget rid of Phi
    const { builder, context: thisContext } = context;
    const startValue = this.declaration
      .map((quad) => quad.toLlvm(context))
      .at(-1)!;

    const fn = builder.GetInsertBlock()!.getParent()!;
    const preHeaderBlock = builder.GetInsertBlock();
    const loopBlock = llvm.BasicBlock.Create(thisContext, 'loop', fn);

    builder.CreateBr(loopBlock);
    builder.SetInsertPoint(loopBlock);

    const variable = builder.CreatePHI(
      llvm.Type.getDoubleTy(thisContext),
      2,
      VarName
    );
    variable.addIncoming(startValue, preHeaderBlock);

    this.statements.forEach((quad) => quad.toLlvm(context));

    const nextVariable = builder.CreateFAdd(variable, StepVal, 'nextvar');

    const condition = this.condition
      .map((quad) => quad.toLlvm(context))
      .at(-1)!;

    const loopEndBlock = builder.GetInsertBlock()!;
    const afterBlock = llvm.BasicBlock.Create(thisContext, 'afterloop', fn);

    builder.CreateCondBr(condition, loopBlock, afterBlock);

    builder.SetInsertPoint(afterBlock);

    variable.addIncoming(nextVariable, loopEndBlock);

    return llvm.Constant.getNullValue(llvm.Type.getInt64Ty(context));
  }
}
