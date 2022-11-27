import fs from 'node:fs';

import type { AstNode } from './ast/definitions/AstNode.js';
import { GlobalQuad } from './quads/definitions/GlobalQuad.js';
import { toQuads } from './quads/index.js';
import { nameParse, typeCheckAst } from './processInput.js';

export async function processAst({
  ast,
  rawText,
  debug = false,
  namedUnparse,
  assemble,
  mips,
  amd,
}: {
  readonly ast: AstNode;
  readonly rawText: string;
  readonly debug?: boolean;
  readonly namedUnparse?: string | undefined;
  readonly assemble?: string | undefined;
  readonly mips?: string | undefined;
  readonly amd?: string | undefined;
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

  if (quads.length !== 1) throw new Error('Found more than one global quad');
  const globalQuad = quads[0];
  if (!(globalQuad instanceof GlobalQuad))
    throw new Error('Top level quad must be an instance of GlobalQuad');

  if (mips !== undefined)
    await fs.promises.writeFile(mips, globalQuad.convertToMips());

  if (amd !== undefined)
    await fs.promises.writeFile(amd, globalQuad.convertToAmd());
}
