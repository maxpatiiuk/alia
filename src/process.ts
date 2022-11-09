import chalk from 'chalk';
import fs from 'node:fs';
import type { Interface } from 'node:readline/promises';

import { parseTreeToAst } from './ast/index.js';
import { ErrorType, typeErrors } from './ast/typing.js';
import { removeNullProductions } from './cykParser/chomsky/removeNullProductions.js';
import { cykParser } from './cykParser/index.js';
import { formatErrors } from './formatErrors.js';
import { formatTokens } from './formatTokens.js';
import { grammar } from './grammar/index.js';
import { slrParser } from './slrParser/index.js';
import { tokenize } from './tokenize/index.js';
import type { Position, Token } from './tokenize/types.js';
import { unparseParseTree } from './unparseParseTree/index.js';
import {
  createPositionResolver,
  createReversePositionResolver,
} from './utils/resolvePosition.js';
import type { RA, WritableArray } from './utils/types.js';
import { AstNode } from './ast/definitions/AstNode.js';
import { PrintContext } from './ast/unparse.js';
import { GlobalsNode } from './ast/definitions/GlobalsNode.js';
import { createScope } from './ast/nameAnalysis.js';

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

async function printTokens(
  rawText: string,
  tokensOutput: string | undefined
): Promise<RA<Token> | undefined> {
  const { formattedErrors, formattedTokens, tokens } = processInput(rawText);

  if (typeof tokensOutput === 'string')
    await fs.promises.writeFile(tokensOutput, formattedTokens);
  if (formattedErrors.length > 0) {
    console.error(formattedErrors);
    process.exitCode = 1;
    return undefined;
  } else return tokens;
}

export async function run(
  rawText: string,
  tokensOutput: string | undefined,
  unparseOutput: string | undefined,
  debug: boolean,
  parser: 'CYK' | 'SLR',
  unparseMode: 'ast' | 'parseTree'
): Promise<AstNode | undefined> {
  const tokens = await printTokens(rawText, tokensOutput);

  if (tokens === undefined) return undefined;

  // Don't include the END token
  const trimmedStream = tokens.slice(0, -1);
  if (parser === 'CYK') {
    if (!cykParser(trimmedStream)) {
      console.error('syntax error\nParse failed');
      process.exitCode = 1;
    }
    return undefined;
  }

  const nullFreeGrammar = removeNullProductions(grammar());
  const parseTree = slrParser(nullFreeGrammar, trimmedStream);
  if (parseTree === undefined) {
    console.error('syntax error\nParse failed');
    process.exitCode = 1;
  }

  if (unparseMode === 'parseTree') {
    if (unparseOutput !== undefined)
      await fs.promises.writeFile(unparseOutput, unparseParseTree(parseTree));
    return undefined;
  }

  const ast = parseTreeToAst(nullFreeGrammar, parseTree);

  const printContext: PrintContext = {
    indent: 0,
    mode: 'pretty',
    debug,
    needWrapping: false,
  };
  if (typeof unparseOutput === 'string') {
    const pretty = ast.pretty(printContext);
    await fs.promises.writeFile(unparseOutput, pretty);
  }

  return ast;
}

export function nameParse(ast: AstNode, debug: boolean): RA<string> | string {
  const errors: WritableArray<string> = [];
  if (!(ast instanceof GlobalsNode))
    throw new Error(
      `Root node must be GlobalsNode, Found ${ast.constructor.name}`
    );
  ast.nameAnalysis({
    symbolTable: [...ast.nameAnalysisContext.symbolTable, createScope(ast)],
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
    debug,
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
    const line = await stream.question(chalk.green('> '));
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
