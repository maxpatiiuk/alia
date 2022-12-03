import { Jmp } from '../../instructions/definitions/amd/Jmp.js';
import { J } from '../../instructions/definitions/mips/J.js';
import { NextComment } from '../../instructions/definitions/NextComment.js';
import { PrevComment } from '../../instructions/definitions/PrevComment.js';
import type { RA } from '../../utils/types.js';
import { filterArray } from '../../utils/types.js';
import { LlvmContext, Quad } from './index.js';
import { LoadQuad } from './LoadQuad.js';
import { Register } from './Register.js';
import llvm from 'llvm-bindings';

export class ReturnQuad extends Quad {
  private readonly loadQuad: LoadQuad;

  public constructor(
    private readonly quads: RA<Quad> | undefined,
    private readonly returnLabel: string
  ) {
    super();
    const tempVariable =
      this.quads === undefined
        ? new Register('$zero', '$0')
        : new Register(
            this.quads.at(-1)!.toMipsValue(),
            this.quads.at(-1)!.toAmdValue()
          );
    this.loadQuad = new LoadQuad(new Register('$v0', '%rax'), tempVariable);
  }

  public toString() {
    return filterArray([
      ...(this.quads ?? []).flatMap((quad) => quad.toString()),
      typeof this.quads === 'object'
        ? `setret ${this.quads.at(-1)!.toValue()}`
        : undefined,
      `goto ${this.returnLabel}`,
    ]);
  }

  public toMips() {
    return [
      new NextComment('BEGIN Return'),
      ...(this.quads ?? []).flatMap((quad) => quad.toMips()),
      ...this.loadQuad.toMips(),
      new J(this.returnLabel),
      new PrevComment('END Return'),
    ];
  }

  public toAmd() {
    return [
      new NextComment('BEGIN Return'),
      ...(this.quads ?? []).flatMap((quad) => quad.toAmd()),
      ...this.loadQuad.toAmd(),
      new Jmp(this.returnLabel),
      new PrevComment('END Return'),
    ];
  }

  /**
   * Each block must end with a terminator. There can be only one terminator per
   * block. Due to these constraints, have to create an unreachable block after
   * the return statement. Otherwise, there may be code printed after the
   * terminator.
   */
  public toLlvm(context: LlvmContext) {
    const { builder, context: thisContext } = context;

    const fn = builder.GetInsertBlock()!.getParent()!;

    const value = this.quads?.map((quad) => quad.toLlvm(context)).at(-1);
    builder.CreateRet(
      value ?? llvm.ConstantInt.get(builder.getInt64Ty(), 0, true)
    );
    const returnEndBlock = llvm.BasicBlock.Create(
      thisContext,
      'deadCodeAfterReturn'
    );
    fn.addBasicBlock(returnEndBlock);
    builder.SetInsertPoint(returnEndBlock);
    return returnEndBlock;
  }
}
