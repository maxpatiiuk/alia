import chalk from 'chalk';
import { createInterface } from 'node:readline/promises';

import type { AstNode } from './ast/definitions.js';
import { handleInput, nameParse, run, typeCheckAst } from './process.js';

const stream = createInterface({
  input: process.stdin,
  output: process.stdout,
});
console.log('Welcome to dragoninterp! Enter Drewgon code to be interpreted...');
let bigAst: AstNode | undefined = undefined;

async function program(): Promise<void> {
  let input = '';
  while (true) {
    const line = await stream.question(
      input.length === 0 ? '' : chalk.gray('. ')
    );

    let ast: AstNode | undefined = undefined;
    if (input.length > 0) input += '\n';
    input = `${input}${line}`;

    try {
      ast = await run(input, undefined, undefined, false, 'SLR', 'ast');
    } catch {
      // Automatically insert semicolons if necessary
      try {
        ast = await run(`${input};`, undefined, undefined, false, 'SLR', 'ast');
      } catch {
        ast = undefined;
      }
    }
    if (ast === undefined) continue;

    ast.nameAnalysisContext = {
      ...ast.nameAnalysisContext,
      symbolTable: [
        ...(bigAst?.nameAnalysisContext?.symbolTable ?? []),
        ...ast.nameAnalysisContext.symbolTable,
      ],
    };

    const nameErrors = nameParse(ast, false);
    if (Array.isArray(nameErrors)) {
      nameErrors.forEach((error) => console.error(error));
      input = '';
      continue;
    }

    const typeErrors = typeCheckAst(ast, input);
    if (typeErrors.length > 0) {
      typeErrors.forEach((error) => console.error(error));
      input = '';
      continue;
    }

    bigAst = ast;
    let returnCalled = false;
    const result = await ast.evaluate({
      output: console.log,
      input: handleInput(stream),
      onReturnCalled() {
        returnCalled = true;
      },
    });
    console.log(chalk.gray(result?.toString() ?? 'undefined'));

    input = '';
    if (returnCalled) {
      if (typeof result === 'number') process.exitCode = result;
      stream.close();
      break;
    }
  }
}

stream.on('close', () => process.exit());

/*
 *Const ast = run(rawText);
 *
 *if (ast === undefined) return;
 *
 *const namedUnparseResults = nameParse(ast);
 *if (namedUnparseResults === undefined) return;
 *if (Array.isArray(namedUnparseResults)) {
 *  namedUnparseResults.forEach((errorMessage) => console.error(errorMessage));
 *  console.error('Name Analysis Failed');
 *  return;
 *}
 *
 *const errors = typeCheckAst(ast, rawText);
 *errors.forEach((errorMessage) => console.error(errorMessage));
 *if (errors.length > 0) console.error('Type Analysis Failed');
 */

program();
