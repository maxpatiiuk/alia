import type { Tokens } from '../../../tokenize/tokens.js';
import type { EvalContext } from '../../eval.js';
import type { QuadsContext } from '../../quads/index.js';
import { StringType } from '../../typing.js';
import type { TokenNode } from '../TokenNode.js';
import { Term } from './index.js';
import { StringQuad } from '../../quads/definitions/StringQuad.js';

export class StringLiteralNode extends Term {
  public constructor(public readonly token: TokenNode) {
    super([token]);
  }

  public typeCheck() {
    return new StringType();
  }

  public pretty(): string {
    return (
      this.token.token.data as Tokens['STRINGLITERAL']
    ).literal.toString();
  }

  public getToken() {
    return this.token;
  }

  public async evaluate(_context: EvalContext) {
    return (this.token.token.data as Tokens['STRINGLITERAL']).literal;
  }

  public toQuads(context: QuadsContext) {
    const value = this.pretty();
    const name = context.requestString(value);
    return [new StringQuad(name)];
  }
}
