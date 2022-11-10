import type { EvalContext } from '../../../eval.js';
import { ReceiveQuad } from '../../../quads/definitions.js';
import type { TypeCheckContext } from '../../../typing.js';
import { assertType } from '../../../typing.js';
import type { PrintContext } from '../../../unparse.js';
import type { IdNode } from '../../term/IdNode.js';
import type { TokenNode } from '../../TokenNode.js';
import { token } from '../../TokenNode.js';
import { PrimaryTypeNode } from '../../types/PrimaryTypeNode.js';
import { VariableDeclaration } from '../VariableDeclaration.js';
import { LineStatement } from './index.js';

export class InputNode extends LineStatement {
  public constructor(
    private readonly token: TokenNode,
    public readonly id: IdNode
  ) {
    super([id]);
  }

  public typeCheck(context: TypeCheckContext) {
    return assertType(context, this.id, 'inputOnFunction', 'int', 'bool');
  }

  public pretty(printContext: PrintContext) {
    return [token('INPUT'), ' ', this.id.print(printContext)];
  }

  public getToken() {
    return this.token;
  }

  public async evaluate(context: EvalContext) {
    const declaration = this.id.getDeclaration();
    if (!(declaration instanceof VariableDeclaration))
      throw new Error('Cannot input a non-literal value');
    const typeNode = declaration.type;
    if (!(typeNode instanceof PrimaryTypeNode))
      throw new Error('Cannot input a non-literal value');
    const type = typeNode.token.token.type === 'INT' ? 'int' : 'bool';
    declaration.value = await context.input(type);
    return declaration.value;
  }

  public toQuads() {
    return [new ReceiveQuad(this.id.getName())];
  }
}
