import { createInterface } from 'node:readline/promises';

import { nameParse, run, typeCheckAst } from './process.js';
import { GlobalsNode } from './ast/definitions.js';

const stream = createInterface({
  input: process.stdin,
  output: process.stdout,
});
console.log('Welcome to dragoninterp! Enter Drewgon code to be interpreted...');
let bigAst: GlobalsNode | undefined = undefined;

async function program(): Promise<void> {
  let input = '';
  while (true) {
    const line = await stream.question(input.length === 0 ? '' : '. ');
    let ast: GlobalsNode | undefined = undefined;
    input = `${input}\n${line}`;
    try {
      ast = run(input);
    } catch {
      ast = undefined;
    }
    if (ast === undefined || !(ast instanceof GlobalsNode)) continue;
    input = '';
    const oldNameContext = bigAst?.nameAnalysisContext;
    bigAst = new GlobalsNode([...(bigAst?.children ?? []), ...ast.children]);
    bigAst.nameAnalysisContext = {
      ...bigAst.nameAnalysisContext,
      symbolTable: [
        ...(oldNameContext?.symbolTable ?? []),
        ...bigAst.nameAnalysisContext.symbolTable,
      ],
    };
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
