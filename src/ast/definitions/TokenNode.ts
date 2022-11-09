import { simpleTokens } from '../../tokenize/definitions.js';
import type { Tokens } from '../../tokenize/tokens.js';
import type { Token } from '../../tokenize/types.js';
import type { RA } from '../../utils/types.js';
import { AstNode } from './AstNode.js';

const indexedSimpleTokens = Object.fromEntries(simpleTokens);
export const token = (token: keyof Tokens) => indexedSimpleTokens[token];

export function assertToken<TOKENS extends keyof Tokens, PRINT extends string>(
  { token }: TokenNode,
  ...expected: RA<TOKENS>
): PRINT {
  if (expected.includes(token.type as TOKENS))
    return indexedSimpleTokens[token.type] as PRINT;
  else
    throw new Error(
      `Invalid token type ${token.type}. Expected one of ${expected.join(', ')}`
    );
}

export class TokenNode extends AstNode {
  public constructor(public readonly token: Token) {
    super([]);
  }

  public pretty() {
    return indexedSimpleTokens[this.token.type];
  }

  public toString() {
    if (this.token.type === 'ID')
      return (this.token.data as Tokens['ID']).literal.toString();
    else if (this.token.type === 'INTLITERAL')
      return (this.token.data as Tokens['INTLITERAL']).literal.toString();
    else if (this.token.type === 'STRINGLITERAL')
      return (this.token.data as Tokens['STRINGLITERAL']).literal.toString();
    else return this.pretty();
  }

  public getToken() {
    return this;
  }
}
