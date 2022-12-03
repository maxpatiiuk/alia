import type { RA } from '../../utils/types.js';
import {
  amdSize,
  LlvmContext,
  mipsSize,
  Quad,
  quadsToAmd,
  quadsToMips,
} from './index.js';
import { SetArgQuad as SetArgumentQuad } from './SetArgQuad.js';
import { QuadsContext } from '../index.js';
import { formatGlobalVariable } from './GlobalVarQuad.js';
import { getPcHelper, mainFunction } from './GlobalQuad.js';
import { TempVariable } from './IdQuad.js';
import { Register } from './Register.js';
import { NextComment } from '../../instructions/definitions/NextComment.js';
import { MovQ } from '../../instructions/definitions/amd/MovQ.js';
import { CallQ } from '../../instructions/definitions/amd/CallQ.js';
import { Addi } from '../../instructions/definitions/mips/Addi.js';
import { Jal } from '../../instructions/definitions/mips/Jal.js';
import { Move } from '../../instructions/definitions/mips/Move.js';
import { Lw } from '../../instructions/definitions/mips/Lw.js';
import { Jr } from '../../instructions/definitions/mips/Jr.js';
import { PrevComment } from '../../instructions/definitions/PrevComment.js';
import { amdTempRegisters } from './FunctionQuad.js';
import { PushQ } from '../../instructions/definitions/amd/PushQ.js';
import { PopQ } from '../../instructions/definitions/amd/PopQ.js';
import { AddQ } from '../../instructions/definitions/amd/AddQ.js';
import { SubQ } from '../../instructions/definitions/amd/SubQ.js';
import { store } from '../../utils/utils.js';
import { GetRetQuad } from './GetRetQuad.js';

export class CallQuad extends Quad {
  private readonly quads: RA<readonly [RA<Quad>, Quad]>;
  private readonly tempsCount: number;
  private readonly needsAlignment: boolean;
  private readonly formattedName: string;
  private readonly preStackOffset: number;
  private readonly postStackOffset: number;
  private readonly returnQuad: GetRetQuad | undefined;

  public constructor(
    context: QuadsContext,
    private readonly actuals: RA<RA<Quad>>,
    private readonly name: string,
    isExternal: boolean,
    private readonly dynamicTempVariable: TempVariable | undefined,
    withReturn: boolean
  ) {
    super();
    this.formattedName =
      isExternal || this.name === mainFunction
        ? this.name
        : formatGlobalVariable(this.name);

    const getTempRegister = store(() => context.requestTempRegister());

    this.quads = this.actuals.map((actual, index) => [
      actual ?? [],
      new SetArgumentQuad(
        index + 1,
        actual?.at(-1)!.toValue(),
        actual === undefined
          ? undefined
          : new Register(
              actual.at(-1)!.toMipsValue(),
              actual.at(-1)!.toAmdValue()
            ),
        getTempRegister(),
        context.requestTemp()
      ),
    ]);
    this.tempsCount = context.getTempCount();
    const stackSize = this.tempsCount;
    const stackPushCount = actuals.length + amdTempRegisters.length;
    this.needsAlignment = stackSize % 2 !== stackPushCount % 2;
    this.preStackOffset = stackSize + (this.needsAlignment ? 1 : 0);
    this.postStackOffset = this.preStackOffset + actuals.length;

    this.returnQuad = withReturn
      ? new GetRetQuad(context.requestTemp())
      : undefined;
  }

  public toString() {
    return [
      ...this.quads
        .flatMap(([quads, setArgumentQuad]) => [...quads, setArgumentQuad])
        .flatMap((quad) => quad.toString()),
      `call ${this.name}`,
      ...(this.returnQuad?.toString() ?? []),
    ];
  }

  public toValue() {
    if (this.returnQuad === undefined)
      throw new Error("Can't get return value from CallStatement");
    return this.returnQuad.toValue();
  }

  public toMips() {
    const stackSize = this.tempsCount * mipsSize;
    return quadsToMips([
      ...this.quads.flatMap(([quads, setArgumentQuad]) => [
        ...quads,
        setArgumentQuad,
      ]),
      new NextComment(`BEGIN Calling ${this.name}`),
      new Addi('$sp', '$sp', -stackSize),
      ...(this.dynamicTempVariable === undefined
        ? [new Jal(this.formattedName)]
        : [
            new NextComment('Calling function by pointer'),
            new Jal(getPcHelper),
            new Move('$ra', '$v0'),
            new NextComment('Offset the return position'),
            new Addi('$ra', '$ra', 4 * mipsSize),
            new Lw('$v0', this.dynamicTempVariable.toMipsValue()),
            new Jr('$v0'),
          ]),
      new Addi('$sp', '$sp', stackSize),
      new PrevComment(`END Calling ${this.name}`),
      ...(this.returnQuad === undefined ? [] : [this.returnQuad]),
    ]);
  }

  public toMipsValue() {
    return this.returnQuad?.toMipsValue() ?? '$v0';
  }

  public toAmd() {
    return quadsToAmd([
      new NextComment(`BEGIN Calling ${this.name}`),
      ...this.quads.flatMap(([quads]) => quads),
      new SubQ(`$${this.preStackOffset * amdSize}`, '%rsp'),
      ...amdTempRegisters.map((register) => new PushQ(register)),
      ...this.quads.map(([_, setArgumentQuad]) => setArgumentQuad),
      ...(this.dynamicTempVariable === undefined
        ? [new CallQ(this.formattedName)]
        : [
            new NextComment('Calling function by pointer'),
            new MovQ(this.dynamicTempVariable.toAmdValue(), '%rax'),
            new CallQ('*%rax'),
          ]),
      ...Array.from(amdTempRegisters)
        .reverse()
        .map((register) => new PopQ(register)),
      new AddQ(`$${this.postStackOffset * amdSize}`, '%rsp'),
      new PrevComment(`END Calling ${this.name}`),
      ...(this.returnQuad === undefined ? [] : [this.returnQuad]),
    ]);
  }

  public toAmdValue() {
    return this.returnQuad?.toAmdValue() ?? '%rax';
  }

  public toLlvm(context: LlvmContext) {
    const { module, builder } = context;
    const fn = module.getFunction(this.formattedName);
    if (fn === null) throw new Error(`Function ${this.name} not found`);

    const actuals = this.actuals.flatMap(
      (quads) => quads.map((quad) => quad.toLlvm(context)).at(-1)!
    );
    return builder.CreateCall(fn, actuals, 'calltmp');
  }
}
