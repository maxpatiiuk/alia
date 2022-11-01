import type { Interface } from 'node:readline/promises';

import type { AstNode, PrintContext } from './ast/definitions.js';
import { createScope, GlobalsNode } from './ast/definitions.js';
import { parseTreeToAst } from './ast/index.js';
import { ErrorType, typeErrors } from './ast/typing.js';
import { removeNullProductions } from './cykParser/chomsky/removeNullProductions.js';
import { formatErrors } from './formatErrors.js';
import { formatTokens } from './formatTokens.js';
import { grammar } from './grammar/index.js';
import { slrParser } from './slrParser/index.js';
import { tokenize } from './tokenize/index.js';
import type { Position, Token } from './tokenize/types.js';
import {
  createPositionResolver,
  createReversePositionResolver,
} from './utils/resolvePosition.js';
import type { RA, WritableArray } from './utils/types.js';

export function processInput(rawText: string): {
  readonly formattedErrors: string;
  readonly formattedTokens: string;
  readonly tokens: RA<Token>;
} {
  const positionResolver = createPositionResolver(rawText);
  const { tokens, syntaxErrors } = tokenize(rawText, 0, positionResolver);

  return {
    formattedErrors: formatErrors(syntaxErrors, positionResolver),
    formattedTokens: formatTokens(tokens),
    tokens,
  };
}

export function run(rawText: string): AstNode | undefined {
  const { tokens } = processInput(rawText);

  if (tokens === undefined) return undefined;

  // Don't include the END token
  const trimmedStream = tokens.slice(0, -1);

  const nullFreeGrammar = removeNullProductions(grammar());
  const parseTree = slrParser(nullFreeGrammar, trimmedStream);
  if (parseTree === undefined) {
    console.error('syntax error\nParse failed');
    process.exitCode = 1;
  }

  return parseTreeToAst(nullFreeGrammar, parseTree);
}

export function nameParse(ast: AstNode): RA<string> | string {
  const errors: WritableArray<string> = [];
  if (!(ast instanceof GlobalsNode))
    throw new Error(
      `Root node must be GlobalsNode, Found ${ast.constructor.name}`
    );
  ast.nameAnalysis({
    symbolTable: [createScope(ast)],
    isDeclaration: false,
    reportError(idNode, error) {
      const { lineNumber, columnNumber } = idNode.getToken().token.position;
      errors.push(
        `FATAL [${lineNumber},${columnNumber}]-[${lineNumber},${
          columnNumber + idNode.getName().length
        }]: ${error}`
      );
    },
  });
  if (errors.length > 0) return errors;

  const printContext: PrintContext = {
    indent: 0,
    mode: 'nameAnalysis',
    debug: false,
    needWrapping: false,
  };

  const output = ast.pretty(printContext);
  return Array.isArray(output) ? output.join('') : output;
}

export function typeCheckAst(ast: AstNode, rawText: string): RA<string> {
  const errors: WritableArray<string> = [];
  ast.typeCheck({
    reportError(node, errorCode) {
      const { lineNumber, columnNumber } = node.getToken().token.position;
      const { lineNumber: endLineNumber, columnNumber: endColumnNumber } =
        getEndPosition(node, rawText);
      errors.push(
        `FATAL [${lineNumber},${columnNumber}]-[${endLineNumber},${endColumnNumber}]: ${typeErrors[errorCode]}`
      );
      return new ErrorType();
    },
  });
  return errors;
}

function getEndPosition(node: AstNode, rawText: string): Position {
  if (node.children.length > 0)
    return getEndPosition(node.children.at(-1)!, rawText);
  const token = node.getToken();
  const simplePosition = createReversePositionResolver(rawText)(
    token.token.position
  );
  const finalPosition = simplePosition + token.toString().length;
  return createPositionResolver(rawText)(finalPosition);
}

const falsyFields = new Set(['false', 'no', 'nan', 'null', '0']);
export const handleInput =
  (stream: Interface) =>
  async <T extends 'bool' | 'int' | 'string'>(
    type: T
  ): Promise<
    T extends 'bool' ? boolean : T extends 'int' ? number : string
  > => {
    let value: boolean | number | string = 0;
    const line = await stream.question('');
    if (type === 'string') value = line;
    else if (type === 'bool')
      value = !falsyFields.has(line.trim().toLowerCase());
    else if (type === 'int') {
      const number = Number.parseInt(line);
      value = Number.isNaN(number) ? 0 : number;
    }
    // @ts-expect-error
    return value;
  };
