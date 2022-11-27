import type { RA, WritableArray } from '../../../utils/types.js';
import type { FormalsDeclNode } from '../../definitions/FormalsDeclNode.js';
import type { StatementList } from '../../definitions/statement/StatementList.js';
import type { QuadsContext } from '../index.js';
import { formatTemp } from '../index.js';
import type { FormalQuad } from './FormalQuad.js';
import { FunctionEpilogueQuad } from './FunctionEpilogueQuad.js';
import { FunctionPrologueQuad } from './FunctionPrologueQuad.js';
import { GetArgQuad as GetArgumentQuad } from './GetArgQuad.js';
import { formatGlobalVariable } from './GlobalVarQuad.js';
import { TempVariable } from './IdQuad.js';
import { Quad } from './index.js';
import { Register } from './Register.js';

export class FunctionQuad extends Quad {
  private readonly enter: Quad;

  private readonly leave: Quad;

  private readonly getArgs: RA<Quad>;

  private readonly statements: RA<Quad>;

  private readonly locals: WritableArray<string> = [];

  // eslint-disable-next-line functional/prefer-readonly-type
  private tempsCount: number;

  public readonly name: string;

  private readonly formals: RA<FormalQuad>;

  public constructor(
    public readonly id: string,
    formalsNode: FormalsDeclNode,
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
    this.formals = formalsNode.toQuads(newContext);
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
      ...this.enter.toString(),
      ...[...this.getArgs, ...this.statements].flatMap((quad) =>
        quad.toString()
      ),
      ...this.leave.toString(),
    ];
  }

  public toMips() {
    return [
      ...this.enter.toMips(),
      ...[...this.getArgs, ...this.statements].flatMap((statement) =>
        statement.toMips()
      ),
      ...this.leave.toMips(),
      '',
    ];
  }

  public toAmd() {
    return [
      ...this.enter.toAmd(),
      ...[...this.getArgs, ...this.statements].flatMap((statement) =>
        statement.toAmd()
      ),
      ...this.leave.toAmd(),
      '',
    ];
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

const tempRegisterCount = 10;
// Using only callee-saved registers to simplify coding
const amdTempRegisters = ['%rbx', '%r12', '%r13', '%r14', '%r15'];
