import { nameParse, typeCheckAst } from './processInput.js';
import fs from 'node:fs';
import { toQuads } from './ast/quads/index.js';
import { AstNode } from './ast/definitions/AstNode.js';

export async function processAst({
  ast,
  rawText,
  debug = false,
  namedUnparse,
  assemble,
  mips,
}: {
  readonly ast: AstNode;
  readonly rawText: string;
  readonly debug?: boolean;
  readonly namedUnparse?: string | undefined;
  readonly assemble?: string | undefined;
  readonly mips?: string | undefined;
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

  const quads = toQuads(ast);
  if (assemble !== undefined)
    await fs.promises.writeFile(
      assemble,
      quads.flatMap((quad) => quad.toString()).join('\n')
    );

  if (mips !== undefined)
    await fs.promises.writeFile(
      mips,
      quads.flatMap((quad) => quad.toMips()).join('\n')
    );
}
