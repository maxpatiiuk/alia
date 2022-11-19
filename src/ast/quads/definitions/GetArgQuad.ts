import type { RA } from '../../../utils/types.js';
import { AssignQuad } from './AssignQuad.js';
import type { FormalQuad } from './FormalQuad.js';
import { reg } from './IdQuad.js';
import { addComment, mem, Quad } from './index.js';
import { LoadQuad } from './LoadQuad.js';
import { parseTempVar } from './FunctionQuad.js';
import { formatTemp } from '../index.js';

export class GetArgQuad extends Quad {
  private readonly loadQuad: LoadQuad;

  private readonly assignQuad: AssignQuad;

  public constructor(
    private readonly index: number,
    private readonly formal: FormalQuad,
    tempRegister: string,
    length: number
  ) {
    super();
    this.loadQuad = new LoadQuad(tempRegister, reg(-(length - this.index) + 1));
    this.assignQuad = new AssignQuad(undefined, this.formal.tempVariable, [
      new Register(tempRegister),
    ]);
  }

  public toString(): RA<string> {
    return [`getarg ${this.index + 1} ${mem(this.formal.id)}`];
  }

  public toMips() {
    return [
      ...addComment(
        this.loadQuad.toMips(),
        `Getting argument "${this.formal.id}"`
      ),
      ...this.assignQuad.toMips(),
    ];
  }
}

export class Register extends Quad {
  private readonly amdRegister: string;

  public constructor(private readonly register: string, amdRegister?: string) {
    super();
    this.amdRegister = amdRegister ?? this.register;
  }

  public toString() {
    return [];
  }

  public toValue() {
    const index = parseTempVar(this.register);
    return mem(typeof index === 'number' ? formatTemp(index) : this.register);
  }

  public toMips() {
    return [];
  }

  public toMipsValue(): string {
    return this.register;
  }

  public toAmd() {
    return [];
  }

  public toAmdValue(): string {
    return this.amdRegister;
  }
}
