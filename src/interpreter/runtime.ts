import chalk from 'chalk';
import fs from 'node:fs';
import type { Interface } from 'node:readline/promises';

import { handleInput, nameParse, run, typeCheckAst } from '../frontEnd.js';
import type { RA } from '../utils/types.js';
import { AstNode } from '../ast/definitions/AstNode.js';
import { ReturnValue } from '../ast/eval.js';
import { Scope } from '../ast/nameAnalysis.js';

/**
 * Provide runtime environment for the interpreter. It will run in the loop
 * asking for input and evaluating it until the user enters `return`.
 *
 * Optionally, a return code can be provided (`return 42`)
 */
export async function runtime(stream: Interface): Promise<void> {
  let symbolTable: RA<Scope> = [];
  const totalInput = [];
  let pendingInput = '';
  while (true) {
    const line = await stream.question(
      pendingInput.length === 0 ? '' : chalk.gray('. ')
    );

    if (await handleCommand(line.trim(), symbolTable, totalInput)) {
      pendingInput = '';
      continue;
    }

    if (pendingInput.length > 0) pendingInput += '\n';
    pendingInput = `${pendingInput}${line}`;

    const { input, ast } = await inputToAst(pendingInput, symbolTable);
    pendingInput = input;
    if (ast === undefined) continue;

    symbolTable = ast.nameAnalysisContext.symbolTable;
    let returnCalled = false;
    const result = await ast.evaluate({
      output: console.log,
      input: handleInput(stream),
      onReturnCalled() {
        returnCalled = true;
      },
    });
    const returnValue = result instanceof ReturnValue ? result.value : result;
    console.log(chalk.gray(returnValue?.toString() ?? 'undefined'));

    totalInput.push(pendingInput);
    pendingInput = '';
    if (returnCalled) {
      if (typeof returnValue === 'number') process.exitCode = returnValue;
      stream.close();
      break;
    }
  }
}

const reSave = /^:save \s*(?<fileName>.+)$/u;
const reType = /^:type \s*(?<expression>.+)$/u;

/**
 * Check if the input string matches one of the meta commands, and if so, handle
 * it
 */
async function handleCommand(
  line: string,
  symbolTable: RA<Scope>,
  totalInput: RA<string>
): Promise<boolean> {
  if (line === ':help') {
    console.log(
      chalk.blue(
        [
          `:help - show this help message\n`,
          `:save <fileName> - save the commands entered in the current session `,
          `into a file\n`,
          `:type <expression> - type check an expression`,
          `:cancel - (when in a middle of entering multi-line expression) `,
          `clears current expression and awaits further input\n`,
          `return 0 - exit the program with exit code 0`,
        ].join('')
      )
    );
    return true;
  } else if (line === ':cancel') return true;
  const fileName = reSave.exec(line)?.groups?.fileName;
  if (typeof fileName === 'string') {
    const { ast } = await inputToAst(totalInput.join('\n'), symbolTable);
    if (ast === undefined) {
      console.log(chalk.red('Unexpected error when saving'));
      return true;
    }
    fs.writeFileSync(
      fileName,
      ast.print({
        indent: 0,
        mode: 'pretty',
        debug: false,
        needWrapping: false,
      })
    );
    console.log(chalk.blue('Output saved'));
    return true;
  }

  const expression = reType.exec(line)?.groups?.expression;
  if (typeof expression === 'string') {
    const { ast } = await inputToAst(expression, symbolTable);
    if (ast === undefined) return true;
    const node = ast?.children.at(-1);
    if (typeof node === 'object') {
      const type = node.typeCheck({
        reportError: () => {
          throw new Error('Should not be called');
        },
      });
      console.log(chalk.blue(type.toString()));
    }
    return true;
  }

  return false;
}

/**
 * Try to create an AST from the pending input and the current symbol table.
 * Then, run name analysis and type analysis and report errors if any.
 */
async function inputToAst(
  rawInput: string,
  symbolTable: RA<Scope>
): Promise<{ readonly input: string; readonly ast: AstNode | undefined }> {
  let input = rawInput;
  let ast: AstNode | undefined;
  try {
    ast = await run({ rawText: input });
  } catch {
    /*
     * Automatically insert trailing semicolon if necessary.
     * I tried modifying the grammar to make semicolons optional, but that
     * resulted in a whole ton of ambiguity errors.
     */
    try {
      const localInput = `${input};`;
      ast = await run({ rawText: localInput });
      input = localInput;
    } catch {
      ast = undefined;
    }
  }
  if (ast === undefined)
    return {
      input,
      ast: undefined,
    };

  ast.nameAnalysisContext = {
    ...ast.nameAnalysisContext,
    symbolTable: [...symbolTable, ...ast.nameAnalysisContext.symbolTable],
  };

  const nameErrors = nameParse(ast, false);
  if (Array.isArray(nameErrors)) {
    nameErrors.forEach((error) => console.error(error));
    return { input: '', ast: undefined };
  }

  const typeErrors = typeCheckAst(ast, input);
  if (typeErrors.length > 0) {
    typeErrors.forEach((error) => console.error(error));
    return { input: '', ast: undefined };
  }
  return { input, ast };
}
