import type { LanguageType, TypeCheckContext } from '../../typing.js';
import { BoolType, IntType, VoidType } from '../../typing.js';
import type { PrintContext } from '../../unparse.js';
import type { TokenNode } from '../TokenNode.js';
import { TypeNode } from './index.js';

export class PrimaryTypeNode extends TypeNode {
  public constructor(public readonly token: TokenNode) {
    super([token]);
  }

  public printType(printContext: PrintContext) {
    return this.print(printContext);
  }

  public typeCheck(_context: TypeCheckContext): LanguageType {
    const type = this.token.token.type;
    if (type === 'INT') return new IntType();
    else if (type === 'BOOL') return new BoolType();
    else if (type === 'VOID') return new VoidType();
    else throw new Error(`Unexpected type ${type} detected`);
  }
}
