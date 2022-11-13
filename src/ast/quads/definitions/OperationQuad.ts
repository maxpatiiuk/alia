import type { RA } from '../../../utils/types.js';
import { AssignQuad } from './AssignQuad.js';
import { addComment, Quad, quadsToMips } from './index.js';
import { QuadsContext } from '../index.js';
import { LoadQuad } from './LoadQuad.js';

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
    private readonly left: string,
    private readonly type: keyof typeof operationTranslations,
    private readonly right: string,
    private readonly tempRegister: string
  ) {
    super();
  }

  public toString() {
    return [];
  }

  public toValue() {
    return `${this.left === '' ? '' : `${this.left} `}${
      operationTranslations[this.type]
    } ${this.right}`;
  }

  public toMips() {
    if (this.type === '--' || this.type === '-')
      return [`sub ${this.tempRegister}, ${this.left}, ${this.right}`];
    else if (this.type === '++' || this.type === '+')
      return [`add ${this.tempRegister}, ${this.left}, ${this.right}`];
    else if (this.type === '*')
      return [
        `mult ${this.left}, ${this.right}`,
        // Note: this does not check for overflow
        `mflo ${this.tempRegister}`,
      ];
    else if (this.type === '/')
      return [
        `div ${this.left}, ${this.right}`,
        // Note: this discards the remainder
        `mflo ${this.tempRegister}`,
      ];
    else if (this.type === 'or')
      return [`or ${this.tempRegister}, ${this.left}, ${this.right}`];
    else if (this.type === 'and')
      return [`and ${this.tempRegister}, ${this.left}, ${this.right}`];
    else if (this.type === '<')
      return [`slt ${this.tempRegister}, ${this.left}, ${this.right}`];
    else if (this.type === '>')
      return [`slt ${this.tempRegister}, ${this.right}, ${this.left}`];
    else if (this.type === '<=')
      return [
        `slt ${this.tempRegister}, ${this.right}, ${this.left}`,
        `xori ${this.tempRegister}, ${this.tempRegister}, 1`,
      ];
    else if (this.type === '>=')
      return [
        `slt ${this.tempRegister}, ${this.left}, ${this.right}`,
        `xori ${this.tempRegister}, ${this.tempRegister}, 1`,
      ];
    else if (this.type === '==')
      return [
        `xor ${this.tempRegister}, ${this.left}, ${this.right}`,
        `sltiu ${this.tempRegister}, ${this.tempRegister}, 1`,
      ];
    else if (this.type === '!=')
      return [
        `xor ${this.tempRegister}, ${this.left}, ${this.right}`,
        `sltu ${this.tempRegister}, $zero, ${this.tempRegister}`,
      ];
    else if (this.type === '!')
      return [
        `sltiu ${this.tempRegister}, ${this.right}, 1`,
        `andi ${this.tempRegister}, ${this.tempRegister}, 0x00ff`,
      ];
    else if (this.type === 'neg')
      return [`sub ${this.tempRegister}, $zero, ${this.right}`];
    else throw new Error(`Unknown operation ${this.type}`);
  }

  public toMipsValue() {
    return this.tempRegister;
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
    const opQuad = new OpQuad(
      this.left?.at(-1)!.toValue() ?? '',
      this.type,
      this.right.at(-1)!.toValue(),
      tempRegister
    );
    this.assignQuad = new AssignQuad(undefined, tempVariable, [opQuad]);

    const leftTemp = context.requestTempRegister();
    const leftValue = this.left?.at(-1)!.toMipsValue();
    this.leftMips =
      leftValue === undefined ? undefined : new LoadQuad(leftTemp, leftValue);

    this.rightMips = new LoadQuad(
      context.requestTempRegister(),
      this.right.at(-1)!.toMipsValue()
    );

    const opMips = new OpQuad(
      this.leftMips?.toMipsValue() ?? '',
      this.type,
      this.rightMips.toMipsValue(),
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
}
