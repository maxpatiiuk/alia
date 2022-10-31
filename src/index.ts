import { nameParse, run, typeCheckAst } from './process.js';

const ast = run(rawText);

if (ast === undefined) return;

const namedUnparseResults = nameParse(ast);
if (namedUnparseResults === undefined) return;
if (Array.isArray(namedUnparseResults)) {
  namedUnparseResults.forEach((errorMessage) => console.error(errorMessage));
  console.error('Name Analysis Failed');
  return;
}

const errors = typeCheckAst(ast, rawText);
errors.forEach((errorMessage) => console.error(errorMessage));
if (errors.length > 0) console.error('Type Analysis Failed');
