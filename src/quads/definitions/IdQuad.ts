import { FunctionDeclaration } from '../../ast/definitions/FunctionDeclaration.js';
import type { VariableDeclaration } from '../../ast/definitions/statement/VariableDeclaration.js';
import { formatTemp } from '../index.js';
import { formatGlobalVariable } from './GlobalVarQuad.js';
import type { LlvmContext } from './index.js';
import { amdSize, mipsSize, Quad } from './index.js';
import { Register } from './Register.js';
import { TermQuad } from './TermQuad.js';
import llvm from 'llvm-bindings';

export class IdQuad extends Quad {
  private readonly quad: Quad;

  public constructor(
    private readonly name: string,
    private readonly tempVariable: TempVariable,
    private readonly declaration: FunctionDeclaration | VariableDeclaration,
    public readonly isFunction: boolean,
    public readonly type: string
  ) {
    super();
    this.quad = new TermQuad(mem(this.name));
  }

  public toString() {
    return this.quad.toString();
  }

  public toValue() {
    return this.quad.toValue();
  }

  public toMips() {
    return [];
  }

  public toMipsValue() {
    return this.tempVariable.toMipsValue();
  }

  public toAmd() {
    return [];
  }

  public toAmdValue() {
    return this.tempVariable.toAmdValue();
  }

  public toLlvm({ builder }: LlvmContext) {
    return this.declaration instanceof FunctionDeclaration
      ? this.declaration.llvmValue
      : builder.CreateLoad(
          this.declaration.llvmValue instanceof llvm.AllocaInst
            ? this.declaration.llvmValue.getAllocatedType()
            : this.declaration.llvmValue.getValueType(),
          this.declaration.llvmValue,
          this.name
        );
  }
}

export class TempVariable extends Register {
  public constructor(public readonly variable: number | string) {
    super(reg(variable), ref(variable));
  }

  public toValue() {
    return mem(this.variable);
  }
}

/**
 * Resolve global variable name or temporary variable index into a MIPS register
 * name
 */
export const reg = (tempVariable: number | string): string =>
  typeof tempVariable === 'string'
    ? formatGlobalVariable(tempVariable)
    : `${tempVariable > 0 ? '-' : ''}${Math.abs(tempVariable) * mipsSize}($fp)`;

/**
 * Resolve global variable name or temporary variable index into an x64 register
 * name
 */
const ref = (tempVariable: number | string): string =>
  typeof tempVariable === 'string'
    ? formatGlobalVariable(tempVariable)
    : `${tempVariable > 0 ? '-' : ''}${Math.abs(tempVariable) * amdSize}(%rbp)`;

/** Wrap an identifier in square brackets (indicates memory access) */
export const mem = (id: number | string): string =>
  typeof id === 'string' &&
  ((id.startsWith('[') && id.endsWith(']')) ||
    !Number.isNaN(Number.parseInt(id)))
    ? id
    : `[${typeof id === 'number' ? formatTemp(id) : id}]`;
