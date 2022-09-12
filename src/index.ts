import { program } from 'commander';
import fs from 'node:fs';

import { process as processInput } from './process.js';

program.name('dgc').description('The ultimate Drewgon compiler');

let input = '';

program
  .argument('<input>', 'path to input file')
  .action((inputString: string) => {
    input = inputString;
  })
  .option('-t, --tokensOutput <string>', 'path to output file for tokens')
  .option('-p, --print', 'parse the input to check syntax', false);

program.parse();

const { tokensOutput, print } = program.opts<{
  readonly tokensOutput?: string;
  readonly print: boolean;
}>();

run(input, tokensOutput, print).catch(console.error);

async function run(
  input: string,
  tokensOutput: string | undefined,
  print: boolean
): Promise<void> {
  const rawText = await fs.promises
    .readFile(input)
    .then((data) => data.toString());

  const { formattedErrors, formattedTokens, parseResult } =
    processInput(rawText);

  if (typeof tokensOutput === 'string')
    await fs.promises.writeFile(tokensOutput, formattedTokens);
  if (formattedErrors.length > 0) {
    console.error(formattedErrors);
    process.exitCode = 1;
  } else if (!parseResult && print) {
    console.error('syntax error\nParse failed');
    process.exitCode = 1;
  }
}
