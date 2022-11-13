import type { RA, WritableArray } from '../../../utils/types.js';
import type { StatementList } from '../../definitions/statement/StatementList.js';
import type { QuadsContext } from '../index.js';
import type { FormalQuad } from './FormalQuad.js';
import { GetArgQuad as GetArgumentQuad } from './GetArgQuad.js';
import { Quad } from './index.js';
import { LineQuad } from './LineQuad.js';
import { FunctionPrologueQuad } from './FunctionPrologueQuad.js';
import { FunctionEpilogueQuad } from './FunctionEpilogueQuad.js';

export class FunctionQuad extends Quad {
  private readonly enter: Quad;

  private readonly leave: Quad;

  private readonly getArgs: RA<Quad>;

  private readonly statements: RA<Quad>;

  private readonly locals: WritableArray<string> = [];

  private readonly temps: WritableArray<string> = [];

  public readonly name: string;

  public constructor(
    public readonly id: string,
    private readonly formals: RA<FormalQuad>,
    statements: StatementList,
    context: QuadsContext
  ) {
    super();
    this.name = formatFunctionName(this.id);
    this.enter = new FunctionPrologueQuad(this.id);
    const leaveLabel = context.requestLabel();
    this.leave = new FunctionEpilogueQuad(leaveLabel, this.id);
    this.getArgs = this.formals.map(
      (formal, index) => new GetArgumentQuad(index + 1, formal.id)
    );

    const temporaryGenerator = context.createTempGenerator();

    this.statements = statements.toQuads({
      ...context,
      requestTemp: () => {
        const temporaryName = temporaryGenerator();
        this.temps.push(temporaryName);
        return temporaryName;
      },
      signalVarDeclaration: (name) => this.locals.push(name),
      returnLabel: leaveLabel,
    });
  }

  public toString() {
    return [
      `[BEGIN ${this.id} LOCALS]`,
      ...this.formals.flatMap((formal) => formal.toString()),
      ...this.locals.map(formatLocal),
      ...this.temps.map(formatTemporary),
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
    return [...this.enter.toMips(), ...this.leave.toMips(), '']
      .map((formatted) =>
        typeof formatted === 'string' ? new LineQuad(formatted) : formatted
      )
      .flatMap((quad) => quad.toString());
  }
}

export const formatFunctionName = (name: string): string => `fun_${name}`;

const formatLocal = (variableName: string): string =>
  `${variableName} (local var of 8 bytes)`;

const formatTemporary = (temporaryName: string): string =>
  `${temporaryName} (tmp var of 8 bytes)`;
