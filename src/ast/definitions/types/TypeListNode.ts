import type { RA } from '../../../utils/types.js';
import type { LanguageType, TypeCheckContext } from '../../typing.js';
import { VoidType } from '../../typing.js';
import type { PrintContext } from '../../unparse.js';
import { token } from '../TokenNode.js';
import { TypeNode } from './index.js';

export class TypeListNode extends TypeNode {
  public constructor(public readonly children: RA<TypeNode>) {
    super(children);
  }

  public pretty(printContext: PrintContext) {
    return this.children
      .map((child) => child.print(printContext))
      .join(`${token('COMMA')} `);
  }

  public printType(printContext: PrintContext): string {
    return this.children
      .map((child) => child.printType(printContext))
      .join(token('COMMA'));
  }

  public typeCheck(context: TypeCheckContext): LanguageType {
    this.children.forEach((child) => child.typeCheck(context));
    return new VoidType();
  }
}
