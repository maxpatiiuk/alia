import { program } from 'commander';
import fs from 'node:fs';

import { parseTreeToAst } from './ast/index.js';
import { removeNullProductions } from './cykParser/chomsky/removeNullProductions.js';
import { cykParser } from './cykParser/index.js';
import { grammar } from './grammar/index.js';
import { process as processInput } from './process.js';
import { slrParser } from './slrParser/index.js';
import { unparseParseTree } from './unparseParseTree/index.js';
import { cretePositionResolver } from './utils/resolvePosition.js';

program.name('dgc').description('The ultimate Drewgon compiler');

let input = '';

// FIXME: update CLI options, makefile and README.md
// FIXME: add a CLI option to pretify with type information
// FIXME: follow the stated format for the function type output
// FIXME: re-read the error reporting guidelines
// FIXME: enforce operator precedence
// FIXME: re-read the project spec just in case

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
    '-m, --unparseMode <string>',
    'parseTree - prettify directly from the parse tree (faster). ast - convert to AST and prettify that (better results)',
    'ast'
  )
  .option(
    '-n, --namedUnparse <string>',
    'the file to which the augmented unparse output will be written. Ignored if unparseMode is not "ast"',
    'parseTree'
  )
  .option('-d, --debug', 'output debug information', false)
  .option(
    '-u, --unparse <string>',
    'path to output file that would include preety-printed program'
  );

program.parse();

const {
  tokensOutput,
  parser: rawParser,
  unparse: unparseOutput,
  debug,
  namedUnparse,
  unparseMode = 'parseTree',
} = program.opts<{
  readonly tokensOutput?: string;
  readonly parser: string;
  readonly unparse?: string;
  readonly debug: boolean;
  readonly namedUnparse?: string;
  readonly unparseMode: string;
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

run(parser, unparseMode).catch(console.error);

async function run(
  parser: 'CYK' | 'SLR',
  unparseMode: 'ast' | 'parseTree'
): Promise<void> {
  const rawText = await fs.promises
    .readFile(input)
    .then((data) => data.toString());

  const { formattedErrors, formattedTokens, tokens } = processInput(rawText);

  if (typeof tokensOutput === 'string')
    await fs.promises.writeFile(tokensOutput, formattedTokens);
  if (formattedErrors.length > 0) {
    console.error(formattedErrors);
    process.exitCode = 1;
    return;
  }

  // Don't include the END token
  const trimmedStream = tokens.slice(0, -1);
  if (parser === 'CYK') {
    if (!cykParser(trimmedStream)) {
      console.error('syntax error\nParse failed');
      process.exitCode = 1;
    }
    return;
  }

  const nullFreeGrammar = removeNullProductions(grammar());
  const parseTree = slrParser(nullFreeGrammar, trimmedStream);
  if (parseTree === undefined) {
    console.error('syntax error\nParse failed');
    process.exitCode = 1;
  }

  if (unparseMode === 'parseTree') {
    if (unparseOutput === undefined) return;
    await fs.promises.writeFile(unparseOutput, unparseParseTree(parseTree));
    return;
  }

  const ast = parseTreeToAst(nullFreeGrammar, parseTree);

  if (typeof unparseOutput === 'string') {
    const pretty = ast.pretty({
      indent: 0,
      mode: 'pretty',
      debug,
      needWrapping: false,
    });
    await fs.promises.writeFile(unparseOutput, pretty);
  }

  if (typeof namedUnparse === 'string') {
    ast.nameAnalysis({
      symbolTable: [],
      positionResolver: cretePositionResolver(rawText),
      isDeclaration: false,
    });
    const pretty = ast.pretty({
      indent: 0,
      mode: 'nameAnalysis',
      debug,
      needWrapping: false,
    });
    await fs.promises.writeFile(namedUnparse, pretty);
  }
}
