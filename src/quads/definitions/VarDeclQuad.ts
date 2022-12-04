import type { TypeNode } from '../../ast/definitions/types/index.js';
import { NextComment } from '../../instructions/definitions/NextComment.js';
import { AssignQuad } from './AssignQuad.js';
import { typeToLlvm } from './FunctionQuad.js';
import type { TempVariable } from './IdQuad.js';
import type { LlvmContext } from './index.js';
import { Quad } from './index.js';
import { Register } from './Register.js';
import { VariableDeclaration } from '../../ast/definitions/statement/VariableDeclaration.js';
import llvm from 'llvm-bindings';
import { FunctionTypeNode } from '../../ast/definitions/types/FunctionTypeNode.js';

export class VarDeclQuad extends Quad {
  public readonly assignQuad: AssignQuad;

  public constructor(
    private readonly id: string,
    private readonly type: TypeNode,
    private readonly tempVariable: TempVariable,
    private readonly varDeclNode: VariableDeclaration
  ) {
    super();
    this.assignQuad = new AssignQuad(undefined, this.tempVariable, [
      new Register('$zero', '$0'),
    ]);
  }

  public toString() {
    return [];
  }

  public toMips() {
    return [
      new NextComment(`Initializing ${this.id}`),
      ...this.assignQuad.toMips(),
    ];
  }

  public toAmd() {
    return [
      new NextComment(`Initializing ${this.id}`),
      ...this.assignQuad.toAmd(),
    ];
  }

  public toLlvm({ builder }: LlvmContext) {
    this.varDeclNode.llvmValue = builder.CreateAlloca(
      typeToLlvm(this.type, builder, true),
      null,
      this.id
    );
    const isPointer = this.varDeclNode.type instanceof FunctionTypeNode;
    if (!isPointer)
      builder.CreateStore(
        llvm.ConstantInt.get(builder.getInt64Ty(), 0, true),
        this.varDeclNode.llvmValue
      );
    return this.varDeclNode.llvmValue;
  }
}
