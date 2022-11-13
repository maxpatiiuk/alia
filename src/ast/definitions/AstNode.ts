import type { RA, WritableArray } from '../../utils/types.js';
import type { EvalContext, EvalReturnValue } from '../eval.js';
import type { NameAnalysisContext } from '../nameAnalysis.js';
import type { LanguageType, TypeCheckContext } from '../typing.js';
import type { PrintContext } from '../unparse.js';
import type { FunctionDeclaration } from './FunctionDeclaration.js';
import type { VariableDeclaration } from './statement/VariableDeclaration.js';
import type { TokenNode } from './TokenNode.js';
import { Quad } from '../quads/definitions/index.js';
import { QuadsContext } from '../quads/index.js';

export abstract class AstNode {
  // eslint-disable-next-line functional/prefer-readonly-type
  public nameAnalysisContext: NameAnalysisContext;

  public readonly declarations: WritableArray<
    FunctionDeclaration | VariableDeclaration
  >;

  public constructor(public readonly children: RA<AstNode>) {
    this.declarations = [];
    this.nameAnalysisContext = {
      symbolTable: [],
      isDeclaration: false,
      reportError: (_idNode, error) => {
        throw new Error(error);
      },
    };
  }

  /**
   * Run Name Analysis on an AST subtree
   */
  public nameAnalysis(context: NameAnalysisContext): void {
    this.nameAnalysisContext = context;
    this.children.forEach((child) => child.nameAnalysis(context));
  }

  /**
   * Traverse the AST and return the type of each node while also reporting
   * any type errors found in the process
   */
  public typeCheck(_context: TypeCheckContext): LanguageType {
    throw new Error('TypeChecker is not declared');
  }

  /**
   * A decorator for the pretty() method that enables additional output
   * when in debug mode (useful for debugging the unparser formatting)
   */
  public print(printContext: PrintContext): string {
    const formatted = this.pretty(printContext);
    const debug = printContext.debug ? `<${this.constructor.name}:` : '';
    return `${debug}${
      Array.isArray(formatted) ? formatted.join('') : formatted
    }${printContext.debug ? '>' : ''}`;
  }

  public pretty(printContext: PrintContext): RA<string> | string {
    return this.children.map((part) => part.print(printContext));
  }

  /**
   * Return a string that represents a stringified TypeNode. Useful when doing
   * unparse with type annotations enabled
   */
  public printType(_printContext: PrintContext): string {
    throw new Error('PrintType is not implemented');
  }

  /**
   * Get a token node. If any type error occurs in this AstNode, the error
   * would be reported at the position of this token.
   */
  public getToken(): TokenNode {
    throw new Error('getToken is not implemented');
  }

  /**
   * Evaluate the AST and return the result
   */
  public async evaluate(_context: EvalContext): Promise<EvalReturnValue> {
    throw new Error('evaluate is not implemented');
  }

  /**
   * Recursively convert AST to 3AC quads
   */
  public toQuads(_context: QuadsContext): RA<Quad> {
    throw new Error('toQuads is not implemented');
  }
}
