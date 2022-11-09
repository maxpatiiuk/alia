import { FormalQuad } from '../../quads/definitions.js';
import { VariableDeclaration } from './VariableDeclaration.js';

export class FormalDeclNode extends VariableDeclaration {
  toQuads() {
    return [new FormalQuad(this.id.getName())];
  }
}
