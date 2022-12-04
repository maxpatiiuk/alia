import { MovQ } from '../../instructions/definitions/amd/MovQ.js';
import { Addi } from '../../instructions/definitions/mips/Addi.js';
import { Sw } from '../../instructions/definitions/mips/Sw.js';
import { NextComment } from '../../instructions/definitions/NextComment.js';
import { PrevComment } from '../../instructions/definitions/PrevComment.js';
import { Syscall } from '../../instructions/definitions/Syscall.js';
import type { RA } from '../../utils/types.js';
import type { QuadsContext } from '../index.js';
import { CallQuad } from './CallQuad.js';
import { mem } from './IdQuad.js';
import type { LlvmContext } from './index.js';
import { Quad } from './index.js';
import { IdNode } from '../../ast/definitions/term/IdNode.js';
import { FunctionDeclaration } from '../../ast/definitions/FunctionDeclaration.js';

export class ReceiveQuad extends Quad {
  private readonly callQuad: CallQuad;

  public constructor(private readonly id: IdNode, context: QuadsContext) {
    super();
    this.callQuad = new CallQuad(
      context,
      [],
      this.id.getDeclaration()!.type.children[0].toString() === 'bool'
        ? 'getBool'
        : 'getInt',
      true,
      undefined,
      false
    );
  }

  public toString(): RA<string> {
    return [`RECEIVE ${mem(this.id.getName())}`];
  }

  public toMips() {
    return [
      new NextComment(`BEGIN Input ${this.id.getName()}`),
      new Addi('$v0', '$zero', 5),
      new Syscall(),
      new Sw('$v0', this.id.getTempVariable().toMipsValue()),
      new PrevComment(`END Input ${this.id.getName()}`),
    ];
  }

  public toAmd() {
    return [
      ...this.callQuad.toAmd(),
      new NextComment(`BEGIN Input ${this.id.getName()}`),
      new MovQ('%rax', this.id.getTempVariable().toAmdValue()),
      new PrevComment(`END Input ${this.id.getName()}`),
    ];
  }

  public toLlvm(context: LlvmContext) {
    const declaration = this.id.getDeclaration()!;
    if (declaration instanceof FunctionDeclaration)
      throw new TypeError('Cannot receive a function');

    return context.builder.CreateStore(
      this.callQuad.toLlvm(context),
      declaration.llvmValue
    );
  }
}
