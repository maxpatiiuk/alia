import type { RA } from '../../utils/types.js';
import type { LanguageType, TypeCheckContext } from '../typing.js';
import { VoidType } from '../typing.js';
import type { PrintContext } from '../unparse.js';
import { AstNode } from './AstNode.js';
import type { FormalDeclNode } from './statement/FormalDeclNode.js';
import { token } from './TokenNode.js';
import { FormalQuad } from '../quads/definitions/FormalQuad.js';

export class FormalsDeclNode extends AstNode {
  public constructor(public readonly children: RA<FormalDeclNode>) {
    super(children);
  }

  public pretty(printContext: PrintContext) {
    return this.children
      .map((child) => child.print(printContext))
      .join(`${token('COMMA')} `);
  }

  public printType(printContext: PrintContext) {
    return this.children
      .map((child) => child.type.printType(printContext))
      .join(',');
  }

  public typeCheck(_context: TypeCheckContext): LanguageType {
    return new VoidType();
  }

  public toQuads(): RA<FormalQuad> {
    return this.children.flatMap((formal) => formal.toQuads());
  }
}
