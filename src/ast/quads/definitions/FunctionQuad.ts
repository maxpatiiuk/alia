import type { R, RA } from '../../../utils/types.js';
import type { StatementList } from '../../definitions/statement/StatementList.js';
import type { QuadsContext } from '../index.js';
import type { FormalQuad } from './FormalQuad.js';
import { GetArgQuad as GetArgumentQuad } from './GetArgQuad.js';
import { Quad } from './index.js';
import { LineQuad } from './LineQuad.js';
import { FunctionPrologueQuad } from './FunctionPrologueQuad.js';
import { FunctionEpilogueQuad } from './FunctionEpilogueQuad.js';
import { formatTemp } from '../index.js';
import { FormalsDeclNode } from '../../definitions/FormalsDeclNode.js';

export class FunctionQuad extends Quad {
  private readonly enter: Quad;

  private readonly leave: Quad;

  private readonly getArgs: RA<Quad>;

  private readonly statements: RA<Quad>;

  private readonly locals: R<number> = {};

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
      return this.tempsCount;
    };
    let tempRegisterIndex = -1;
    const newContext: QuadsContext = {
      ...context,
      requestTemp,
      getTempCount: () => this.tempsCount,
      declareVar: (name) => {
        this.locals[name] = requestTemp();
        return this.locals[name];
      },
      requestTempRegister: () => {
        tempRegisterIndex += 1;
        /*
         * Cycle though all registers to avoid assigning the same register twice
         * (operations would use 2 registers at most, thus this function can
         * be safely called many times in large functions)
         */
        const resolvedIndex = tempRegisterIndex % tempRegisterCount;
        return `$t${resolvedIndex}`;
      },
      returnLabel: context.requestLabel(),
    };

    this.name = formatFunctionName(this.id);
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
      ...Object.keys(this.locals).map(formatLocal),
      ...Array.from({ length: this.tempsCount }, (_, index) =>
        formatTemporary(index)
      ),
      `[END ${this.id} LOCALS]`,
      ...this.enter.toString(),
      ...[...this.getArgs, ...this.statements]
        .flatMap((quad) => quad.toString())
        .map((formatted) =>
          typeof formatted === 'string' ? new LineQuad(formatted) : formatted
        )
        .flatMap((quad) => quad.toString()),
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
    ]
      .map((formatted) =>
        typeof formatted === 'string' ? new LineQuad(formatted) : formatted
      )
      .flatMap((quad) => quad.toMips());
  }
}

export const formatFunctionName = (name: string): string => `fun_${name}`;

const formatLocal = (variableName: string): string =>
  `${variableName} (local var of 8 bytes)`;

const formatTemporary = (tempIndex: number): string =>
  `${formatTemp(tempIndex)} (tmp var of 8 bytes)`;

const tempRegisterCount = 10;
