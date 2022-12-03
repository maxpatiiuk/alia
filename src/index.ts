/**
 * Entrypoint for the compiler. Handles CLI arguments and runs the rest of the
 * code
 */

import { program } from 'commander';
import fs from 'node:fs';

import { run } from './frontEnd.js';
import { processAst } from './backEnd.js';

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
    '-u, --unparse <string>',
    'path to output file that would include pretty-printed program'
  )
  .option('-d, --debug', 'output debug information', false)
  .option(
    '-n, --namedUnparse <string>',
    'the file to which the augmented unparse output will be written. Ignored if unparseMode is not "ast"'
  )
  .option(
    '-a, --assemble <string>',
    'generate a 3AC representation of the program'
  )
  .option(
    '-d, --diagramPath <string>',
    'path to the output diagram for the grammar in the DOT format'
  )
  .option('-m, --mips <string>', 'compile the program down to MIPS assembly')
  .option('-o, --amd <string>', 'compile the program down to x64 assembly')
  .option('-l, --llvm <string>', 'compile the program down to LLVM assembly')
  .option(
    '-r, --dontOptimize',
    "don't run peephole optimization or dead code removal",
    false
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
  llvm,
  dontOptimize,
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
  readonly llvm?: string;
  readonly dontOptimize: boolean;
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
      llvm,
      optimize: !dontOptimize,
    });
  })
  .catch(console.error);

// TODO: rename the language
// TODO: update all documentation places that mention x64 (or amd) and MIPS
//    to also use LLVM
// TODO: add a link to llvm and llvm assembly docs
// TODO: move all outputs into a "dist" directory
// TODO: generate all outputs and provide them by default in "dist"
// TODO: add "Architecture" section for LLVM
// TODO: add "Compiling" section for LLVM
// TODO: go over TODOs in README.md (they are not picked up by the IDE)
// TODO: mention https://llvm.org/docs/tutorial/MyFirstLanguageFrontend/LangImpl05.html was used as a reference
