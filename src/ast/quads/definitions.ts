import type { RA } from '../../utils/types.js';
import type { StatementList } from '../definitions/statement/StatementList.js';
import type { QuadsContext } from './index.js';

export class Quad {
  /** Convert quad to a printable string */
  public toString(): RA<string> {
    throw new Error('Not implemented');
  }

  /** Get the name of the temp variable created by the quad */
  public toValue(): string {
    throw new Error('Not implemented');
  }
}

export class GlobalQuad extends Quad {
  public constructor(
    private readonly globals: RA<string>,
    private readonly strings: RA<{
      readonly name: string;
      readonly value: string;
    }>
  ) {
    super();
  }

  public toString(): RA<string> {
    return [
      '[BEGIN GLOBALS]',
      ...this.globals,
      ...this.strings.flatMap(({ name, value }) => `${name} ${value}`),
      '[END GLOBALS]',
    ];
  }
}

export class FunctionQuad extends Quad {
  private readonly enter: LabelQuad;

  private readonly leave: LabelQuad;

  private readonly getArgs: RA<LineQuad>;

  private readonly statements: RA<Quad>;

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
      (formal, index) => new LineQuad(new GetArgQuad(index + 1, formal.id))
    );

    this.statements = statements.toQuads({
      ...context.createContext(),
      returnLabel: leaveLabel,
    });
  }

  public toString() {
    return [
      `[BEGIN ${this.id} LOCALS]`,
      ...this.formals.flatMap((formal) => formal.toString()),
      // FIXME: add quads for locals and temp
      `[END ${this.id} LOCALS]`,
      ...this.enter.toString(),
      ...this.getArgs.flatMap((getArgument) => getArgument.toString()),
      ...this.statements.flatMap((quad) => quad.toString()),
      ...this.leave.toString(),
    ];
  }
}

export class FormalQuad extends Quad {
  public constructor(public readonly id: string) {
    super();
  }

  public toString(): RA<string> {
    return [`${this.id} (formal arg of 8 bytes)`];
  }
}

const labelOffset = 12;

export class LabelQuad extends Quad {
  public constructor(
    private readonly label: string,
    private readonly quad: Quad
  ) {
    super();
  }

  public toString(): RA<string> {
    const lines = this.quad.toString();
    if (lines.length !== 1) throw new Error('LabelQuad called on invalid quad');
    return [
      `${this.label}:${' '.repeat(
        Math.max(0, labelOffset - this.label.length - 1)
      )}${lines[0]}`,
    ];
  }
}

export class LineQuad extends Quad {
  public constructor(private readonly quad: Quad) {
    super();
  }

  public toString(): RA<string> {
    const lines = this.quad.toString();
    if (lines.length !== 1) throw new Error('LabelQuad called on invalid quad');
    return [`${' '.repeat(labelOffset)}${lines[0]}`];
  }
}

export class CallQuad extends Quad {
  public readonly name = 'call';
}

export class SimpleQuad extends Quad {
  public constructor(
    public readonly name: string,
    private readonly operation: string
  ) {
    super();
  }

  public toString(): RA<string> {
    return [`${this.name} ${this.operation}`];
  }
}

export class AssignQuad extends Quad {
  public constructor(
    public readonly id: string,
    private readonly expression: RA<Quad>
  ) {
    super();
  }

  public toString(): RA<string> {
    return [
      ...this.expression.flatMap((quad) => quad.toString()),
      `${mem(this.id)} := ${this.expression.at(-1)!.toValue()}`,
    ];
  }

  public toValue(): string {
    return this.id;
  }
}

export class ReportQuad extends Quad {
  public constructor(private readonly quads: RA<Quad>) {
    super();
  }

  public toString(): RA<string> {
    return [
      ...this.quads.flatMap((quad) => quad.toString()),
      `REPORT ${mem(this.quads.at(-1)!.toValue())}`,
    ];
  }
}

export class ReceiveQuad extends Quad {
  public constructor(private readonly id: string) {
    super();
  }

  public toString(): RA<string> {
    return [`RECEIVE ${mem(this.id)}`];
  }
}

export class GotoQuad extends Quad {
  public readonly name = 'goto';
}

export class IfzQuad extends Quad {
  public readonly name = 'ifx';
}

export class NopQuad extends Quad {
  public readonly name = 'nop';
}

export class GetArgQuad extends Quad {
  public constructor(
    private readonly index: number,
    private readonly id: string
  ) {
    super();
  }

  public toString(): RA<string> {
    return [`getarg ${this.index} ${mem(this.id)}`];
  }
}

export class GetRetQuad extends Quad {
  public readonly name = 'getret';
}

export class SetArgQuad extends Quad {
  public readonly name = 'setarg';
}

export class SetRetQuad extends Quad {
  public readonly name = 'setret';
}

/** Wrap an identifier in square brackets (indicates memory access) */
export const mem = (id: string): string => `[${id}]`;

export class PostQuad extends Quad {
  private readonly quad: AssignQuad;

  public constructor(id: string, type: '--' | '++') {
    super();
    this.quad = new AssignQuad(id, [new OpQuad(mem(id), type, '1')]);
  }

  public toString(): RA<string> {
    return this.quad.toString();
  }
}

export class TermQuad extends Quad {
  public constructor(private readonly term: string) {
    super();
  }

  public toString(): RA<string> {
    return [];
  }

  public toValue(): string {
    return this.term;
  }
}

const operationTranslations = {
  '--': 'SUB64',
  '++': 'ADD64',
  '+': 'ADD64',
  '-': 'SUB64',
  '*': 'MULT64',
  '/': 'DIV64',
  or: 'OR64',
  and: 'AND64',
  eq: 'EQ64',
  '<': 'LT64',
  '>': 'GT64',
  '<=': 'LTE64',
  '>=': 'GTE64',
  neg: 'NEG64',
  '!': 'NOT64',
  '==': 'EQ64',
  '!=': 'NEQ64',
} as const;

export class OpQuad extends TermQuad {
  public constructor(
    left: string,
    type: keyof typeof operationTranslations,
    right: string
  ) {
    super(
      `${left === '' ? '' : `${left} `}${operationTranslations[type]} ${right}`
    );
  }
}

export class OperationQuad extends Quad {
  private readonly opQuad: OpQuad;

  public constructor(
    private readonly left: RA<Quad> | undefined,
    type: keyof typeof operationTranslations,
    private readonly right: RA<Quad>
  ) {
    super();

    this.opQuad = new OpQuad(
      this.left?.at(-1)!.toValue() ?? '',
      type,
      this.right.at(-1)!.toValue()
    );
  }

  public toString(): RA<string> {
    return [
      ...(this.left ?? []).flatMap((quad) => quad.toString()),
      ...this.right.flatMap((quad) => quad.toString()),
      ...this.opQuad.toString(),
    ];
  }
}
