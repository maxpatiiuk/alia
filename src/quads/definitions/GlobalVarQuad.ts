import llvm from 'llvm-bindings';

import { QuadGlobal } from '../../instructions/definitions/amd/QuadGlobal.js';
import { Label } from '../../instructions/definitions/Label.js';
import { WordGlobal } from '../../instructions/definitions/mips/WordGlobal.js';
import type { LlvmContext } from './index.js';
import { Quad } from './index.js';
import { FunctionDeclaration } from '../../ast/definitions/FunctionDeclaration.js';
import { VariableDeclaration } from '../../ast/definitions/statement/VariableDeclaration.js';
import { FunctionTypeNode } from '../../ast/definitions/types/FunctionTypeNode.js';
import { typeToLlvm } from './FunctionQuad.js';

export class GlobalVarQuad extends Quad {
  private readonly name: string;

  private readonly id: string;

  private readonly labelQuad: Label | undefined;

  public constructor(
    private readonly node: FunctionDeclaration | VariableDeclaration,
    public readonly value: number | undefined
  ) {
    super();
    this.id = this.node.id.getName();

    this.name = formatGlobalVariable(this.id);
    this.labelQuad =
      typeof this.value === 'number' ? new Label(this.name) : undefined;
  }

  public toString() {
    return [this.id];
  }

  public toMips() {
    return this.labelQuad === undefined || this.value === undefined
      ? []
      : [this.labelQuad, new WordGlobal(this.value)];
  }

  public toAmd() {
    return this.labelQuad === undefined || this.value === undefined
      ? []
      : [this.labelQuad, new QuadGlobal(this.value)];
  }

  public toLlvm({ module, builder }: LlvmContext) {
    const isPointer =
      this.node instanceof VariableDeclaration &&
      this.node.type instanceof FunctionTypeNode;
    this.node.llvmValue = new llvm.GlobalVariable(
      module,
      isPointer
        ? typeToLlvm(this.node.type, builder, true)
        : builder.getInt64Ty(),
      false,
      llvm.GlobalVariable.LinkageTypes.ExternalLinkage,
      isPointer
        ? llvm.ConstantPointerNull.get(
            typeToLlvm(this.node.type, builder, true)
          )
        : llvm.ConstantInt.get(builder.getInt64Ty(), this.value!, true),
      this.name
    );
    return this.node.llvmValue;
  }
}

export const formatGlobalVariable = (name: string): string => `global_${name}`;
export const formatFunctionName = (name: string): string => `fun_${name}`;
