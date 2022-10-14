import fs from 'node:fs';

import type { AstNode, PrintContext } from './ast/definitions.js';
import { parseTreeToAst } from './ast/index.js';
import { removeNullProductions } from './cykParser/chomsky/removeNullProductions.js';
import { cykParser } from './cykParser/index.js';
import { formatErrors } from './formatErrors.js';
import { formatTokens } from './formatTokens.js';
import { grammar } from './grammar/index.js';
import { slrParser } from './slrParser/index.js';
import { tokenize } from './tokenize/index.js';
import type { Token } from './tokenize/types.js';
import { unparseParseTree } from './unparseParseTree/index.js';
import { cretePositionResolver } from './utils/resolvePosition.js';
import type { RA, WritableArray } from './utils/types.js';

export function processInput(rawText: string): {
  readonly formattedErrors: string;
  readonly formattedTokens: string;
  readonly tokens: RA<Token>;
} {
  const { tokens, syntaxErrors } = tokenize(rawText, 0);

  const positionResolver = cretePositionResolver(rawText);

  return {
    formattedErrors: formatErrors(syntaxErrors, positionResolver),
    formattedTokens: formatTokens(tokens, positionResolver),
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

export function namedParse(
  rawText: string,
  ast: AstNode,
  printContext: PrintContext
): RA<string> | string {
  const positionResolver = cretePositionResolver(rawText);
  const errors: WritableArray<string> = [];
  ast.nameAnalysis({
    symbolTable: [ast.createScope()],
    isDeclaration: false,
    reportError(idNode, token, error) {
      const { lineNumber, columnNumber } = positionResolver(
        token.token.simplePosition
      );
      errors.push(
        `[${lineNumber},${columnNumber}]-[${lineNumber},${
          columnNumber + idNode.print(printContext).length
        }] ${error}`
      );
    },
  });
  if (errors.length > 0) return errors;
  const output = ast.pretty({
    ...printContext,
    mode: 'nameAnalysis',
  });
  return Array.isArray(output) ? output.join('') : output;
}
