import { createInterface } from 'node:readline/promises';

import type { AstNode } from './ast/definitions.js';
import { GlobalsNode } from './ast/definitions.js';
import { handleInput, nameParse, run, typeCheckAst } from './process.js';

const stream = createInterface({
  input: process.stdin,
  output: process.stdout,
});
console.log('Welcome to dragoninterp! Enter Drewgon code to be interpreted...');
let bigAst: AstNode | undefined = undefined;

// TODO: exit the program on return statement
async function program(): Promise<void> {
  let input = '';
  while (true) {
    const line = await stream.question(input.length === 0 ? '' : '. ');
    let ast: AstNode | undefined = undefined;
    input = `${input}\n${line}`;
    try {
      ast = run(input);
    } catch {
      ast = undefined;
    }
    if (ast === undefined) continue;
    const oldNameContext = bigAst?.nameAnalysisContext;
    const newAst = new GlobalsNode([
      ...(bigAst?.children ?? []),
      ...ast.children,
    ]);
    newAst.nameAnalysisContext = {
      ...newAst.nameAnalysisContext,
      symbolTable: [
        ...(oldNameContext?.symbolTable ?? []),
        ...newAst.nameAnalysisContext.symbolTable,
      ],
    };
    const nameErrors = nameParse(newAst);
    if (Array.isArray(nameErrors)) {
      nameErrors.forEach((error) => console.error(error));
      input = '';
      continue;
    }
    const typeErrors = typeCheckAst(newAst, input);
    if (typeErrors.length > 0) {
      typeErrors.forEach((error) => console.error(error));
      input = '';
      continue;
    }
    bigAst = newAst;
    ast.evaluate({
      output: console.log,
      input: handleInput(stream),
    });
    input = '';
  }
}

stream.on('close', () => {
  console.log(
    bigAst?.print({
      indent: 0,
      mode: 'pretty',
      debug: false,
      needWrapping: false,
    })
  );
  process.exit(0);
});

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
