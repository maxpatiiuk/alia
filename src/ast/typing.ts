import type { RA } from '../utils/types.js';
import type { AstNode, TypeCheckContext } from './definitions.js';
import { FunctionTypeNode } from './definitions.js';

export class LanguageType {
  public toString(): string {
    throw new Error('Not implemented');
  }
}

export class BoolType extends LanguageType {
  public toString(): string {
    return 'bool';
  }
}

export class ErrorType extends LanguageType {
  public toString(): string {
    return 'error';
  }
}

export class FunctionType extends LanguageType {
  constructor(public readonly type: FunctionTypeNode) {
    super();
  }

  public toString(): string {
    return this.type.print({
      indent: 0,
      mode: 'pretty',
      debug: false,
      needWrapping: false,
      reversePositionResolver: () => 0,
    });
  }
}

export class IntType extends LanguageType {
  public toString(): string {
    return 'int';
  }
}

export class StringType extends LanguageType {
  public toString(): string {
    return 'string';
  }
}

export class VoidType extends LanguageType {
  public toString(): string {
    return 'void';
  }
}

const types = {
  bool: BoolType,
  error: ErrorType,
  function: FunctionType,
  int: IntType,
  string: StringType,
  void: VoidType,
} as const;
type ReturnTypes = typeof types;

export function assertType<TYPES extends keyof ReturnTypes>(
  context: TypeCheckContext,
  node: AstNode,
  errorCode: keyof typeof typeErrors,
  ...expectedTypes: RA<TYPES>
): ErrorType | ReturnTypes[TYPES] {
  const type = node.typeCheck(context);
  if (type instanceof ErrorType) return type;
  else if (
    expectedTypes.every(
      (expectedType) => !(type instanceof types[expectedType])
    )
  ) {
    context.reportError(node, errorCode);
    return new ErrorType();
  } else return type as ReturnTypes[TYPES];
}

/**
 * If there is any error in an expression, the whole expression should be of
 * error type
 */
export const cascadeError = (
  ...types: RA<LanguageType | undefined>
): LanguageType =>
  types.find((node) => node instanceof ErrorType) ??
  types.at(-1) ??
  new VoidType();

export const typeErrors = {
  nonBoolLoop: 'Non-bool expression used as a loop condition',
  nonBoolIf: 'Non-bool expression used as an if condition',
  nonBoolLogic: 'Logical operator applied to non-bool operand',
  nonIntArith: 'Arithmetic operator applied to invalid operand',
  inputOnFunction: 'Attempt to assign user input to function',
  outputOnVoid: 'Attempt to output void',
  outputOnFunction: 'Attempt to output a function',
  invalidEqOperand: 'Invalid equality operand',
  invalidEqOperation: 'Invalid equality operation',
  relationalInt: 'Relational operator applied to non-numeric operand',
  invalidOperand: 'Invalid assignment operand',
  invalidAssign: 'Invalid assignment operation',
  nonFuncCall: 'Attempt to call a non-function',
  wrongReturn: 'Bad return value',
  voidReturn: 'Return with a value in void function',
  noReturn: 'Missing return value',
  argLength: 'Function call with wrong number of args',
  argType: 'Type of actual does not match type of formal',
} as const;
