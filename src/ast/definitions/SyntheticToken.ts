import type { AstNode } from './AstNode.js';
import { TokenNode } from './TokenNode.js';

/**
 * Error messages include the ranges in source code where the error occurred.
 * If there is a single token that matches the range exactly, that token is
 * used to generate the error message. Otherwise, a SyntheticToken can be
 * used to generate an error message that spans between two AST nodes.
 */
export class SyntheticToken extends TokenNode {
  public constructor(startNode: AstNode) {
    super({
      type: 'VOID',
      data: {},
      position: startNode.getToken().token.position,
    });
  }
}
