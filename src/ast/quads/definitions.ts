import { RA } from '../../utils/types.js';
import { QuadsContext } from './index.js';

export class Quad {
  public toString(): RA<string> {
    throw new Error('Not implemented');
  }
}

export class GlobalQuad extends Quad {
  public constructor(private readonly globals: RA<string>) {
    super();
  }

  public toString(): RA<string> {
    return ['[BEGIN GLOBALS]', ...this.globals, '[END GLOBALS]'];
  }
}

export class FunctionQuad extends Quad {
  private readonly enter: LabelQuad;
  private readonly leave: LabelQuad;
  private readonly getArgs: RA<GetArgQuad>;

  public constructor(
    private readonly id: string,
    private readonly formals: RA<FormalQuad>,
    context: QuadsContext
  ) {
    super();
    this.enter = new LabelQuad(
      `fun_${this.id}`,
      new SimpleQuad('enter', this.id)
    );
    // FIXME: incrementally set the label
    this.leave = new LabelQuad(
      context.requestLabel(),
      new SimpleQuad('leave', this.id)
    );
    this.getArgs = this.formals.map(
      (formal, index) => new GetArgQuad(index, formal.id)
    );
    const childContext = context.createContext();
  }

  public toString(): RA<string> {
    return [
      `[BEGIN ${this.id} LOCALS]`,
      ...this.formals.flatMap((formal) => formal.toString()),
      // FIXME: add quads for locals and temp
      `[END ${this.id} LOCALS]`,
      ...this.enter.toString(),
      ...this.getArgs.flatMap((getArg) => getArg.toString()),
      // FIXME: add quads for body
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
    return [
      `${this.label}:${' '.repeat(
        Math.max(0, labelOffset - this.label.length - 1)
      )}${this.quad.toString()}`,
    ];
  }
}

export class LineQuad extends Quad {
  public constructor(private readonly quad: Quad) {
    super();
  }

  public toString(): RA<string> {
    return [`${' '.repeat(labelOffset)}${this.quad.toString()}`];
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

export class AssignQuad extends Quad {}

export class BinOpQuad extends Quad {
  /*case ADD64: return "ADD64";
  case SUB64: return "SUB64";
  case DIV64: return "DIV64";
  case MULT64: return "MULT64";
  case OR64: return "OR64";
  case AND64: return "AND64";
  case EQ64: return "EQ64";
  case NEQ64: return "NEQ64";
  case LT64: return "LT64";
  case GT64: return "GT64";
  case LTE64: return "LTE64";
  case GTE64: return "GTE64";*/
}

export class UnaryOpQuad extends Quad {
  // NEG64 NOT8
}

export class ReportQuad extends Quad {
  public readonly name = 'REPORT';
}

export class ReceiveQuad extends Quad {
  public readonly name = 'RECEIVE';
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
    return [`getarg ${this.index} [${this.id}]`];
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
