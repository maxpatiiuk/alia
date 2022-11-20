import type { RA } from '../../../utils/types.js';
import { AssignQuad } from './AssignQuad.js';
import { addComment, Quad, quadsToMips } from './index.js';
import { QuadsContext } from '../index.js';
import { LoadQuad } from './LoadQuad.js';
import { Register } from './GetArgQuad.js';

const operationTranslations = {
  '--': 'SUB64',
  '++': 'ADD64',
  '+': 'ADD64',
  '-': 'SUB64',
  '*': 'MULT64',
  '/': 'DIV64',
  or: 'OR64',
  and: 'AND64',
  '<': 'LT64',
  '>': 'GT64',
  '<=': 'LTE64',
  '>=': 'GTE64',
  '==': 'EQ64',
  '!=': 'NEQ64',
  '!': 'NOT64',
  neg: 'NEG64',
} as const;

export class OpQuad extends Quad {
  public constructor(
    private readonly left: Quad | undefined,
    private readonly type: keyof typeof operationTranslations,
    private readonly right: Quad,
    private readonly tempRegister: Register
  ) {
    super();
  }

  public toString() {
    return [];
  }

  public toValue() {
    return `${this.left === undefined ? '' : `${this.left.toValue()} `}${
      operationTranslations[this.type]
    } ${this.right.toValue()}`;
  }

  public toMips() {
    const left = this.left?.toMipsValue() ?? '';
    const right = this.right.toMipsValue();
    const temp = this.tempRegister.toMipsValue();
    if (this.type === '--' || this.type === '-')
      return [`sub ${temp}, ${left}, ${right}`];
    else if (this.type === '++' || this.type === '+')
      return [`add ${temp}, ${left}, ${right}`];
    else if (this.type === '*')
      return [
        `mult ${left}, ${right}`,
        // Note: this does not check for overflow
        `mflo ${temp}`,
      ];
    else if (this.type === '/')
      return [
        `div ${left}, ${right}`,
        // Note: this discards the remainder
        `mflo ${temp}`,
      ];
    else if (this.type === 'or') return [`or ${temp}, ${left}, ${right}`];
    else if (this.type === 'and') return [`and ${temp}, ${left}, ${right}`];
    else if (this.type === '<') return [`slt ${temp}, ${left}, ${right}`];
    else if (this.type === '>') return [`slt ${temp}, ${right}, ${left}`];
    else if (this.type === '<=')
      return [`slt ${temp}, ${right}, ${left}`, `xori ${temp}, ${temp}, 1`];
    else if (this.type === '>=')
      return [`slt ${temp}, ${left}, ${right}`, `xori ${temp}, ${temp}, 1`];
    else if (this.type === '==')
      return [`xor ${temp}, ${left}, ${right}`, `sltiu ${temp}, ${temp}, 1`];
    else if (this.type === '!=')
      return [`xor ${temp}, ${left}, ${right}`, `sltu ${temp}, $zero, ${temp}`];
    else if (this.type === '!')
      return [`sltiu ${temp}, ${right}, 1`, `andi ${temp}, ${temp}, 0x00ff`];
    else if (this.type === 'neg') return [`sub ${temp}, $zero, ${right}`];
    else throw new Error(`Unknown operation ${this.type}`);
  }

  public toMipsValue() {
    return this.tempRegister.toMipsValue();
  }
}

export class OperationQuad extends Quad {
  private readonly assignQuad: AssignQuad;
  private readonly assignMips: AssignQuad;
  private readonly leftMips: LoadQuad | undefined;
  private readonly rightMips: LoadQuad;

  public constructor(
    private readonly left: RA<Quad> | undefined,
    private readonly type: keyof typeof operationTranslations,
    private readonly right: RA<Quad>,
    context: QuadsContext
  ) {
    super();

    const tempVariable = context.requestTemp();
    const tempRegister = context.requestTempRegister();
    const leftValue = this.left?.at(-1)!.toValue() ?? '';
    const opQuad = new OpQuad(
      leftValue === '' ? undefined : new Register(leftValue),
      this.type,
      new Register(this.right.at(-1)!.toValue()),
      tempRegister
    );
    this.assignQuad = new AssignQuad(undefined, tempVariable, [opQuad]);

    const leftTemp = context.requestTempRegister();
    const leftRegister =
      this.left === undefined
        ? this.left
        : new Register(
            this.left?.at(-1)!.toMipsValue(),
            this.left?.at(-1)!.toAmdValue()
          );
    this.leftMips =
      leftRegister === undefined
        ? undefined
        : new LoadQuad(leftTemp, leftRegister);

    this.rightMips = new LoadQuad(
      context.requestTempRegister(),
      new Register(
        this.right.at(-1)!.toMipsValue(),
        this.right.at(-1)!.toAmdValue()
      )
    );

    const opMips = new OpQuad(
      this.leftMips,
      this.type,
      this.rightMips,
      tempRegister
    );
    this.assignMips = new AssignQuad(undefined, tempVariable, [opMips]);
  }

  public toString() {
    return [
      ...(this.left ?? []).flatMap((quad) => quad.toString()),
      ...this.right.flatMap((quad) => quad.toString()),
      ...this.assignQuad.toString(),
    ];
  }

  public toValue() {
    return this.assignQuad.toValue();
  }

  public toMips() {
    return addComment(
      quadsToMips([
        ...(this.left ?? []),
        ...this.right,
        ...(this.leftMips?.toMips() ?? []),
        this.rightMips,
        this.assignMips,
      ]),
      `Operation: ${operationTranslations[this.type]}`
    );
  }

  public toMipsValue() {
    return this.assignMips.toMipsValue();
  }

  // FIXME: implement toAmd

  public toAmdValue() {
    return this.assignMips.toAmdValue();
  }
}
