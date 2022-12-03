/**
 * A mega function that does all the compilation steps that come after AST
 * generation
 *
 * This function represents the middle-end and the back-end of the compiler.
 */

import fs from 'node:fs';

import type { AstNode } from './ast/definitions/AstNode.js';
import { GlobalQuad } from './quads/definitions/GlobalQuad.js';
import { toQuads } from './quads/index.js';
import { nameParse, typeCheckAst } from './frontEnd.js';

export async function processAst({
  ast,
  rawText,
  debug = false,
  namedUnparse,
  assemble,
  mips,
  amd,
  llvm,
  optimize = true,
}: {
  readonly ast: AstNode;
  readonly rawText: string;
  readonly debug?: boolean;
  readonly namedUnparse?: string | undefined;
  readonly assemble?: string | undefined;
  readonly mips?: string | undefined;
  readonly amd?: string | undefined;
  readonly llvm?: string | undefined;
  readonly optimize?: boolean;
}): Promise<void> {
  const namedUnparseResults = nameParse(ast, debug);
  if (namedUnparseResults === undefined) return;
  if (Array.isArray(namedUnparseResults)) {
    namedUnparseResults.forEach((errorMessage) => console.error(errorMessage));
    console.error('Name Analysis Failed');
    return;
  } else if (typeof namedUnparse === 'string')
    await fs.promises.writeFile(namedUnparse, namedUnparseResults);

  const errors = typeCheckAst(ast, rawText);
  errors.forEach((errorMessage) => console.error(errorMessage));
  if (errors.length > 0) console.error('Type Analysis Failed');

  const quads = toQuads(ast, optimize);
  if (assemble !== undefined)
    await fs.promises.writeFile(
      assemble,
      quads.flatMap((quad) => quad.toString()).join('\n')
    );

  if (quads.length !== 1) throw new Error('Found more than one global quad');
  const globalQuad = quads[0];
  if (!(globalQuad instanceof GlobalQuad))
    throw new Error('Top level quad must be an instance of GlobalQuad');

  if (mips !== undefined)
    await fs.promises.writeFile(mips, globalQuad.convertToMips());

  if (amd !== undefined)
    await fs.promises.writeFile(amd, globalQuad.convertToAmd());

  if (llvm !== undefined)
    await fs.promises.writeFile(llvm, globalQuad.convertToLlvm(debug));
}
