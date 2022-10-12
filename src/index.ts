import { program } from 'commander';
import fs from 'node:fs';

import { parseTreeToAst } from './ast/index.js';
import { removeNullProductions } from './cykParser/chomsky/removeNullProductions.js';
import { grammar } from './grammar/index.js';
import { cykParser } from './cykParser/index.js';
import { process as processInput } from './process.js';
import { slrParser } from './slrParser/index.js';
import { unparseParseTree } from './unparseParseTree/index.js';

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
    '-m, --unparseMode <string>',
    'parseTree - prettify directly from the parse tree (faster). ast - convert to AST and prettify that (better results)',
    'parseTree'
  )
  .option(
    '-u, --unparse <string>',
    'path to output file that would include preety-printed program'
  );

program.parse();

const {
  tokensOutput,
  parser: rawParser,
  unparse,
  unparseMode = 'parseTree',
} = program.opts<{
  readonly tokensOutput?: string;
  readonly parser: string;
  readonly unparse?: string;
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

run(input, tokensOutput, parser, unparse, unparseMode).catch(console.error);

async function run(
  input: string,
  tokensOutput: string | undefined,
  parser: 'CYK' | 'SLR',
  unparseOutput: string | undefined,
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
  } else {
    const nullFreeGrammar = removeNullProductions(grammar());
    const parseTree = slrParser(nullFreeGrammar, trimmedStream);
    if (parseTree === undefined) {
      console.error('syntax error\nParse failed');
      process.exitCode = 1;
    }
    if (unparseOutput === undefined) return;

    const pretty =
      unparseMode === 'parseTree'
        ? unparseParseTree(parseTree)
        : parseTreeToAst(nullFreeGrammar, parseTree).pretty();
    await fs.promises.writeFile(unparseOutput, pretty);
  }
}
