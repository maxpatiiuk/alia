import type { RA, WritableArray } from '../../../utils/types.js';
import type { StatementList } from '../../definitions/statement/StatementList.js';
import type { QuadsContext } from '../index.js';
import type { FormalQuad } from './FormalQuad.js';
import { GetArgQuad as GetArgumentQuad } from './GetArgQuad.js';
import { Quad } from './index.js';
import { LabelQuad } from './LabelQuad.js';
import { LineQuad } from './LineQuad.js';
import { SimpleQuad } from './SimpleQuad.js';

export class FunctionQuad extends Quad {
  private readonly enter: LabelQuad;

  private readonly leave: LabelQuad;

  private readonly getArgs: RA<Quad>;

  private readonly statements: RA<Quad>;

  private readonly locals: WritableArray<string> = [];

  private readonly temps: WritableArray<string> = [];

  public constructor(
    private readonly id: string,
    private readonly formals: RA<FormalQuad>,
    statements: StatementList,
    context: QuadsContext
  ) {
    super();
    this.enter = new LabelQuad(
      `fun_${this.id}`,
      new SimpleQuad('enter', this.id)
    );
    const leaveLabel = context.requestLabel();
    this.leave = new LabelQuad(leaveLabel, new SimpleQuad('leave', this.id));
    this.getArgs = this.formals.map(
      (formal, index) => new GetArgumentQuad(index + 1, formal.id)
    );

    const temporaryGenerator = context.createTempGenerator();

    this.statements = statements.toQuads({
      ...context,
      requestTemp: () => {
        const tempName = temporaryGenerator();
        this.temps.push(tempName);
        return tempName;
      },
      signalVarDeclaration: (name) => this.locals.push(name),
      returnLabel: leaveLabel,
    });
  }

  public toString(): RA<string> {
    return [
      `[BEGIN ${this.id} LOCALS]`,
      ...this.formals.flatMap((formal) => formal.toString()),
      ...this.locals.map(formatLocal),
      ...this.temps.map(formatTemp),
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
}

const formatLocal = (variableName: string): string =>
  `${variableName} (local var of 8 bytes)`;

const formatTemp = (tempName: string): string =>
  `${tempName} (tmp var of 8 bytes)`;
