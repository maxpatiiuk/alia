import { VariableDeclaration } from './VariableDeclaration.js';
import { FormalQuad } from '../../quads/definitions/FormalQuad.js';

export class FormalDeclNode extends VariableDeclaration {
  toQuads() {
    return [new FormalQuad(this.id.getName())];
  }
}
