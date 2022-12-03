import type { RA, WritableArray } from '../../utils/types.js';
import type { FormalsDeclNode } from '../../ast/definitions/FormalsDeclNode.js';
import type { StatementList } from '../../ast/definitions/statement/StatementList.js';
import type { QuadsContext } from '../index.js';
import { formatTemp } from '../index.js';
import type { FormalQuad } from './FormalQuad.js';
import { FunctionEpilogueQuad } from './FunctionEpilogueQuad.js';
import { FunctionPrologueQuad } from './FunctionPrologueQuad.js';
import { GetArgQuad as GetArgumentQuad } from './GetArgQuad.js';
import { formatGlobalVariable } from './GlobalVarQuad.js';
import { TempVariable } from './IdQuad.js';
import { LlvmContext, Quad, quadsToString } from './index.js';
import { Register } from './Register.js';
import { BlankLine } from '../../instructions/definitions/amd/BlankLink.js';
import { inlineLabels } from './GlobalQuad.js';
import llvm from 'llvm-bindings';
import { TypeNode } from '../../ast/definitions/types/index.js';
import { PrimaryTypeNode } from '../../ast/definitions/types/PrimaryTypeNode.js';
import { FunctionTypeNode } from '../../ast/definitions/types/FunctionTypeNode.js';

export class FunctionQuad extends Quad {
  private readonly enter: FunctionPrologueQuad;

  private readonly leave: FunctionEpilogueQuad;

  private readonly getArgs: RA<Quad>;

  private readonly statements: RA<Quad>;

  private readonly locals: WritableArray<string> = [];

  // eslint-disable-next-line functional/prefer-readonly-type
  private tempsCount: number;

  public readonly name: string;

  private readonly formals: RA<FormalQuad>;

  public constructor(
    private readonly type: FunctionTypeNode,
    public readonly id: string,
    private readonly formalsNode: FormalsDeclNode,
    statements: StatementList,
    context: QuadsContext
  ) {
    super();

    this.tempsCount = 0;
    const requestTemp = () => {
      this.tempsCount += 1;
      return new TempVariable(this.tempsCount);
    };
    let tempRegisterIndex = -1;
    const newContext: QuadsContext = {
      ...context,
      requestTemp,
      getTempCount: () => this.tempsCount,
      declareVar: (name) => {
        const tempIndex = requestTemp();
        // Don't set local if current variable is a formal
        if (Array.isArray(this.formals)) this.locals.push(name);
        return tempIndex;
      },
      requestTempRegister: () => {
        tempRegisterIndex += 1;
        /*
         * Cycle though all registers to avoid assigning the same register twice
         * (operations would use 2 registers at most, thus this function can
         * be safely called many times in large functions)
         */
        const mipsIndex = tempRegisterIndex % tempRegisterCount;
        const amdIndex = tempRegisterIndex % amdTempRegisters.length;
        const mipsVar = createMipsTempVar(mipsIndex);
        const amdVar = amdTempRegisters[amdIndex];
        return new Register(mipsVar, amdVar);
      },
      returnLabel: context.requestLabel(),
    };

    this.name = formatGlobalVariable(this.id);
    this.enter = new FunctionPrologueQuad(this.id, newContext);
    this.leave = new FunctionEpilogueQuad(newContext.returnLabel, this.id);

    const tempRegister = newContext.requestTempRegister();
    this.formals = this.formalsNode.toQuads(newContext);
    this.getArgs = this.formals.map(
      (formal, index, { length }) =>
        new GetArgumentQuad(index, formal, tempRegister, length)
    );

    this.statements = statements.toQuads(newContext);
  }

  public toString() {
    return [
      `[BEGIN ${this.id} LOCALS]`,
      ...this.formals.flatMap((formal) => formal.toString()),
      ...this.locals.map(formatLocal),
      ...Array.from({ length: this.tempsCount }, (_, index) =>
        formatTemporary(index)
      ),
      `[END ${this.id} LOCALS]`,
      ...inlineLabels(
        quadsToString([
          ...this.enter.toString(),
          ...[...this.getArgs, ...this.statements].flatMap((quad) =>
            quad.toString()
          ),
          ...this.leave.toString(),
        ])
      ),
    ];
  }

  public toMips() {
    return [
      ...this.enter.toMips(),
      ...[...this.getArgs, ...this.statements].flatMap((statement) =>
        statement.toMips()
      ),
      ...this.leave.toMips(),
      new BlankLine(),
    ];
  }

  public toAmd() {
    return [
      ...this.enter.toAmd(),
      ...[...this.getArgs, ...this.statements].flatMap((statement) =>
        statement.toAmd()
      ),
      ...this.leave.toAmd(),
      new BlankLine(),
    ];
  }

  public toLlvm(context: LlvmContext) {
    const { builder, module, context: thisContext } = context;
    // Function
    const fn = llvm.Function.Create(
      typeToLlvm(this.type, builder, false),
      llvm.Function.LinkageTypes.ExternalLinkage,
      this.name,
      module
    );

    this.formalsNode.children.forEach((node, index) => {
      node.llvmValue = fn.getArg(index);
      node.llvmValue.setName(node.id.getName());
    });

    const entryBlock = llvm.BasicBlock.Create(thisContext, 'entry', fn);
    builder.SetInsertPoint(entryBlock);

    if (llvm.verifyFunction(fn))
      throw new Error('Verifying LLVM function failed');

    this.statements.forEach((statement) => statement.toLlvm(context));

    return fn;
  }
}

const formatLocal = (variableName: string): string =>
  `${variableName} (local var of 8 bytes)`;

const formatTemporary = (tempIndex: number): string =>
  `${formatTemp(tempIndex)} (tmp var of 8 bytes)`;

const createMipsTempVar = (index: number): string => `$t${index}`;

const reTempVar = /^\$t(?<index>\d+)$/;

export function parseTempVar(index: string): number | undefined {
  const value = reTempVar.exec(index)?.groups?.index;
  return typeof value === 'string' ? Number.parseInt(value) : undefined;
}

export function typeToLlvm(
  type: TypeNode,
  builder: llvm.IRBuilder,
  pointer: boolean
): llvm.Type {
  if (type instanceof PrimaryTypeNode) return builder.getInt64Ty();
  else if (type instanceof FunctionTypeNode) {
    const returnType = typeToLlvm(type.returnType, builder, true);
    const formals = type.typeList.children.map((formal) =>
      typeToLlvm(formal, builder, true)
    );
    const functionType = llvm.FunctionType.get(returnType, formals, false);
    return pointer ? llvm.PointerType.get(functionType, 0) : functionType;
  } else throw new Error('Unsupported type');
}

const tempRegisterCount = 10;
// Using only callee-saved registers to simplify coding
export const amdTempRegisters = ['%rbx', '%r12', '%r13', '%r14', '%r15'];
// 8-bit versions of the above registers
