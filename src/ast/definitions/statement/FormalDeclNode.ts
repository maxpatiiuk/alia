import { VariableDeclaration } from './VariableDeclaration.js';
import { FormalQuad } from '../../../quads/definitions/FormalQuad.js';
import { QuadsContext } from '../../../quads/index.js';

export class FormalDeclNode extends VariableDeclaration {
  toQuads(context: QuadsContext) {
    super.toQuads(context);
    const tempVariable = this.id.getTempVariable();
    if (typeof tempVariable.variable === 'string')
      throw new Error('Unexpected global variable as a formal');
    return [new FormalQuad(this.id.getName(), tempVariable)];
  }
}
