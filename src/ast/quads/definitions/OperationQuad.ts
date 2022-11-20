import type { RA } from '../../../utils/types.js';
import { AssignQuad } from './AssignQuad.js';
import { addComment, Quad, quadsToAmd, quadsToMips } from './index.js';
import { QuadsContext } from '../index.js';
import { LoadQuad } from './LoadQuad.js';
import { Register } from './Register.js';

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

  public toAmd() {
    const left = this.left?.toAmdValue() ?? '';
    const right = this.right.toAmdValue();
    const temp = this.tempRegister.toAmdValue();
    if (this.type === '--' || this.type === '-')
      return [`movq ${left}, ${temp}`, `subq ${right}, ${temp}`];
    else if (this.type === '++' || this.type === '+')
      return [`movq ${left}, ${temp}`, `addq ${right}, ${temp}`];
    else if (this.type === '*')
      return [
        `movq ${left}, ${temp}`,
        `movq ${right}, %rax`,
        `imulq %rax`,
        // Note: this does not check for overflow
        `movq %rax, ${temp}`,
      ];
    else if (this.type === '/')
      return [
        `movq $0, %rdx`,
        `movq ${left}, %rax`,
        `idivq ${right}`,
        `movq %rax, ${temp}`,
        // Note: this discards the remainder
      ];
    else if (this.type === 'or')
      return [`movq ${left}, ${temp}`, `orq ${right}, ${temp}`];
    else if (this.type === 'and')
      return [`movq ${left}, ${temp}`, `andq ${right}, ${temp}`];
    else if (this.type === '<')
      return [`movq ${left}, ${temp}`, `setl ${right}, ${temp}`];
    else if (this.type === '>')
      return [`movq ${left}, ${temp}`, `setg ${right}, ${temp}`];
    else if (this.type === '<=')
      return [`movq ${left}, ${temp}`, `setle ${right}, ${temp}`];
    else if (this.type === '>=')
      return [`movq ${left}, ${temp}`, `setge ${right}, ${temp}`];
    else if (this.type === '==')
      return [`movq ${left}, ${temp}`, `sete ${right}, ${temp}`];
    else if (this.type === '!=')
      return [`movq ${left}, ${temp}`, `setne ${right}, ${temp}`];
    else if (this.type === '!')
      return [`movq ${right}, ${temp}`, `not ${temp}`];
    else if (this.type === 'neg')
      return [`movq ${right}, ${temp}`, `neg ${temp}`];
    else throw new Error(`Unknown operation ${this.type}`);
  }

  public toAmdValue() {
    return this.tempRegister.toAmdValue();
  }
}

export class OperationQuad extends Quad {
  private readonly assignQuad: AssignQuad;
  private readonly assignUniversal: AssignQuad;
  private readonly leftLoad: LoadQuad | undefined;
  private readonly rightLoad: LoadQuad;

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
    this.leftLoad =
      leftRegister === undefined
        ? undefined
        : new LoadQuad(leftTemp, leftRegister);

    this.rightLoad = new LoadQuad(
      context.requestTempRegister(),
      new Register(
        this.right.at(-1)!.toMipsValue(),
        this.right.at(-1)!.toAmdValue()
      )
    );

    const opMips = new OpQuad(
      this.leftLoad,
      this.type,
      this.rightLoad,
      tempRegister
    );
    this.assignUniversal = new AssignQuad(undefined, tempVariable, [opMips]);
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
        ...(this.leftLoad?.toMips() ?? []),
        this.rightLoad,
        this.assignUniversal,
      ]),
      `Operation: ${operationTranslations[this.type]}`
    );
  }

  public toMipsValue() {
    return this.assignUniversal.toMipsValue();
  }

  public toAmd() {
    return addComment(
      quadsToAmd([
        ...(this.left ?? []),
        ...this.right,
        ...(this.leftLoad?.toAmd() ?? []),
        this.rightLoad,
        this.assignUniversal,
      ]),
      `Operation: ${operationTranslations[this.type]}`
    );
  }

  public toAmdValue() {
    return this.assignUniversal.toAmdValue();
  }
}
