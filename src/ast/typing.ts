import type {RA} from '../utils/types.js';
import type {AstNode, TypeCheckContext} from './definitions.js';

export type LanguageType = 'bool' | 'error' | 'function' | 'int' | 'string' | 'void';

export function assertType<TYPES extends LanguageType>(
  context: TypeCheckContext,
  node: AstNode,
  errorCode: keyof typeof typeErrors,
  ...expectedTypes: RA<TYPES>
): TYPES | 'error' {
  const type = node.typeCheck(context);
  if (!expectedTypes.includes(type as TYPES) && type !== 'error')
    context.reportError(node, typeErrors[errorCode]);
  return type as TYPES;
}

/**
 * If there is any error in an expression, the whole expression should be of
 * error type
 */
export const cascadeError = (
  ...types: RA<LanguageType | undefined>
): LanguageType =>
  types.includes('error') ? 'error' : types.at(-1) ?? 'void';

export const typeErrors = {
  nonBoolLoop: 'Non-bool expression used as a loop condition',
  nonBoolIf: 'Non-bool expression used as an if condition',
  nonInt: 'Arithmetic operator applied to invalid operand',
  invalidEqOperand: 'Invalid equality operand',
  invalidEqOperation: 'Invalid equality operation',
  relationalInt: 'Relational operator applied to non-numeric operand',
} as const;