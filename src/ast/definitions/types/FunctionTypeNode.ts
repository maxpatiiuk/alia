import type { EvalContext } from '../../eval.js';
import type { LanguageType, TypeCheckContext } from '../../typing.js';
import { FunctionType } from '../../typing.js';
import type { PrintContext } from '../../unparse.js';
import { token } from '../TokenNode.js';
import { TypeNode } from './index.js';
import type { TypeListNode } from './TypeListNode.js';

export class FunctionTypeNode extends TypeNode {
  public readonly typeNode: FunctionType;

  public constructor(
    public readonly typeList: TypeListNode,
    public readonly returnType: TypeNode
  ) {
    super([typeList, returnType]);
    this.typeNode = new FunctionType(this);
  }

  public pretty(printContext: PrintContext) {
    return [
      token('FN'),
      ' ',
      token('LPAREN'),
      this.typeList.print(printContext),
      token('RPAREN'),
      token('ARROW'),
      this.returnType.print(printContext),
    ];
  }

  public printType(printContext: PrintContext) {
    return [
      this.typeList.printType(printContext),
      token('ARROW'),
      this.returnType.printType(printContext),
    ].join('');
  }

  public typeCheck(_context: TypeCheckContext): LanguageType {
    return this.typeNode;
  }

  public async evaluate(_context: EvalContext) {
    return this.printType({
      indent: 0,
      mode: 'nameAnalysis',
      debug: false,
      needWrapping: false,
    });
  }
}
