import type { Tokens } from '../../../tokenize/tokens.js';
import type { EvalContext } from '../../eval.js';
import { IntType } from '../../typing.js';
import type { TokenNode } from '../TokenNode.js';
import { Term } from './index.js';

export class IntLiteralNode extends Term {
  public constructor(public readonly token: TokenNode) {
    super([token]);
  }

  public typeCheck() {
    return new IntType();
  }

  public pretty(): string {
    return (this.token.token.data as Tokens['INTLITERAL']).literal.toString();
  }

  public getToken() {
    return this.token;
  }

  public async evaluate(_context: EvalContext) {
    return (this.token.token.data as Tokens['INTLITERAL']).literal;
  }
}
