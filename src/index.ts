import { program } from 'commander';
import fs from 'node:fs';

import { cykParser } from './cykParser/index.js';
import { process as processInput } from './process.js';
import { slrParser } from './slrParser/index.js';
import { unparseAst } from './unparseAst/index.js';

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
    'the parser to use. Allowed values include CYK and LR1. Note, unparser is only available for the LR1 parser',
    'LR1'
  )
  .option(
    '-u, --unparse',
    'path to output file that would include preety-printed program'
  );

program.parse();

const {
  tokensOutput,
  parser: rawParser,
  unparse,
} = program.opts<{
  readonly tokensOutput?: string;
  readonly parser: string;
  readonly unparse?: string;
}>();

const parser = rawParser.toUpperCase().trim();
if (parser !== 'CYK' && parser !== 'SLR')
  throw new Error(
    `Unknown parser "${parser}". Allowed values include CYK and SLR.`
  );

run(input, tokensOutput, parser, unparse).catch(console.error);

async function run(
  input: string,
  tokensOutput: string | undefined,
  parser: 'CYK' | 'SLR',
  unparseOutput: string | undefined
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
    const ast = slrParser(trimmedStream);
    if (ast === undefined) {
      console.error('syntax error\nParse failed');
      process.exitCode = 1;
    }
    if (unparseOutput === undefined) return;
    const unparse = unparseAst(ast);
    await fs.promises.writeFile(unparseOutput, unparse);
  }
}
