import { program } from 'commander';
import fs from 'node:fs';

import { run } from './processInput.js';
import { processAst } from './processAst.js';

program.name('dgc').description('The ultimate Drewgon compiler');

let input = '';

program
  .argument('<input>', 'path to input file')
  .action((inputString: string) => {
    input = inputString;
  })
  .option('-t, --tokensOutput <string>', 'path to output file for tokens')
  .option(
    '-p, --parser <string>',
    'the parser to use. Allowed values include CYK and SLR. Note, unparser is only available for the SLR parser',
    'SLR'
  )
  .option(
    '--unparseMode <string>',
    'parseTree - prettify directly from the parse tree (faster). ast - convert to AST and prettify that (better results)',
    'ast'
  )
  .option(
    '-n, --namedUnparse <string>',
    'the file to which the augmented unparse output will be written. Ignored if unparseMode is not "ast"'
  )
  .option(
    '-a, --assemble <string>',
    'generate a 3AC representation of the program'
  )
  .option('-d, --debug', 'output debug information', false)
  .option(
    '-d, --diagramPath <string>',
    'path to the output diagram for the grammar in the DOT format'
  )
  .option('-m, --mips <string>', 'compile the program down to MIPS assembly')
  .option('-o, --amd <string>', 'compile the program down to x64 assembly')
  .option(
    '-u, --unparse <string>',
    'path to output file that would include pretty-printed program'
  );

program.parse();

const {
  tokensOutput,
  parser: rawParser,
  unparse: unparseOutput,
  debug,
  namedUnparse,
  assemble,
  unparseMode = 'parseTree',
  diagramPath,
  mips,
  amd,
} = program.opts<{
  readonly tokensOutput?: string;
  readonly parser: string;
  readonly unparse?: string;
  readonly debug: boolean;
  readonly namedUnparse?: string;
  readonly unparseMode: string;
  readonly assemble?: string;
  readonly diagramPath?: string;
  readonly mips?: string;
  readonly amd?: string;
}>();

const parser = rawParser.toUpperCase().trim();
if (parser !== 'CYK' && parser !== 'SLR')
  throw new Error(
    `Unknown parser "${parser}". Allowed values include CYK and SLR.`
  );
if (unparseMode !== 'ast' && unparseMode !== 'parseTree')
  throw new Error(
    `Unknown unparse mode "${unparseMode}". Allowed values include ast and parseTree.`
  );

const readFile = async (): Promise<string> =>
  fs.promises.readFile(input).then((data) => data.toString());

readFile()
  .then(async (rawText) => {
    const ast = await run({
      rawText,
      tokensOutput,
      unparseOutput,
      debug,
      parser,
      unparseMode,
      diagramPath,
    });

    if (ast === undefined) return undefined;

    return processAst({
      ast,
      rawText,
      debug,
      namedUnparse,
      assemble,
      mips,
      amd,
    });
  })
  .catch(console.error);
