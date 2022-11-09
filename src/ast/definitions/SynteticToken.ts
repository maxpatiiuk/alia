import type { AstNode } from './AstNode.js';
import { TokenNode } from './TokenNode.js';

export class SynteticToken extends TokenNode {
  public constructor(startNode: AstNode) {
    super({
      type: 'VOID',
      data: {},
      position: startNode.getToken().token.position,
    });
  }
}
