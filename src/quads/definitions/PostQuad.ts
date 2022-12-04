import { DecQ } from '../../instructions/definitions/amd/DecQ.js';
import { IncQ } from '../../instructions/definitions/amd/IncQ.js';
import type { QuadsContext } from '../index.js';
import { AssignQuad } from './AssignQuad.js';
import { LlvmContext, Quad } from './index.js';
import { IntLiteralQuad } from './IntLiteralQuad.js';
import { LoadQuad } from './LoadQuad.js';
import { OpQuad } from './OperationQuad.js';
import { Register } from './Register.js';
import { NextComment } from '../../instructions/definitions/NextComment.js';
import { PrevComment } from '../../instructions/definitions/PrevComment.js';
import { IdNode } from '../../ast/definitions/term/IdNode.js';
import { FunctionDeclaration } from '../../ast/definitions/FunctionDeclaration.js';
import llvm from 'llvm-bindings';

export class PostQuad extends Quad {
  private readonly quad: AssignQuad;

  private readonly intQuad: IntLiteralQuad;

  private readonly loadQuad: LoadQuad;

  private readonly mipsQuad: AssignQuad;

  private readonly amdOp: DecQ | IncQ;

  private readonly amdQuad: AssignQuad;

  public constructor(
    private readonly id: IdNode,
    context: QuadsContext,
    private readonly type: '--' | '++'
  ) {
    super();
    const tempVariable = this.id.getTempVariable();
    const tempRegister = context.requestTempRegister();
    this.quad = new AssignQuad(this.id.getName(), tempVariable, [
      new OpQuad(
        new Register(this.id.getName()),
        this.type,
        new Register('1'),
        tempRegister
      ),
    ]);

    const intRegister = context.requestTempRegister();
    this.intQuad = new IntLiteralQuad(1, intRegister, context.requestTemp());
    this.loadQuad = new LoadQuad(tempRegister, tempVariable);
    this.mipsQuad = new AssignQuad(undefined, tempVariable, [
      new OpQuad(this.loadQuad, this.type, intRegister, tempRegister),
    ]);

    this.amdOp = new (this.type === '--' ? DecQ : IncQ)(
      tempRegister.toAmdValue()
    );
    this.amdQuad = new AssignQuad(undefined, tempVariable, [tempRegister]);
  }

  public toString() {
    return this.quad.toString();
  }

  public toValue() {
    return this.id.getName();
  }

  public toMips() {
    return [
      new NextComment(`BEGIN Post${this.type === '--' ? 'Dec' : 'Inc'}`),
      ...this.intQuad.toMips(),
      ...this.loadQuad.toMips(),
      ...this.mipsQuad.toMips(),
      new PrevComment(`END Post${this.type === '--' ? 'Dec' : 'Inc'}`),
    ];
  }

  public toMipsValue(): string {
    return this.mipsQuad.toMipsValue();
  }

  public toAmd() {
    return [
      new NextComment(`BEGIN Post${this.type === '--' ? 'Dec' : 'Inc'}`),
      ...this.loadQuad.toAmd(),
      this.amdOp,
      ...this.amdQuad.toAmd(),
      new PrevComment(`END Post${this.type === '--' ? 'Dec' : 'Inc'}`),
    ];
  }

  public toAmdValue() {
    return this.amdQuad.toAmdValue();
  }

  public toLlvm({ builder }: LlvmContext) {
    const declaration = this.id.getDeclaration()!;
    if (declaration instanceof FunctionDeclaration)
      throw new TypeError('Unexpected function declaration');
    const loaded = builder.CreateLoad(
      declaration.llvmValue instanceof llvm.AllocaInst
        ? declaration.llvmValue.getAllocatedType()
        : declaration.llvmValue.getValueType(),
      declaration.llvmValue,
      this.id.getName()
    );
    const result = builder[this.type === '++' ? 'CreateAdd' : 'CreateSub'](
      loaded,
      llvm.ConstantInt.get(builder.getInt64Ty(), 1, true),
      'addtmp'
    );
    return builder.CreateStore(result, declaration.llvmValue);
  }
}
