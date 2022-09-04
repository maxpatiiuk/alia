import { program } from 'commander';
import fs from 'node:fs';

import { process } from './process.js';

program.name('dgc').description('The ultimate Drewgon compiler');

let input = '';

program
  .argument('<input>', 'path to input file')
  .action((inputString: string) => {
    input = inputString;
  })
  .requiredOption('-p, --print', 'parse the input to check syntax')
  .requiredOption(
    '-t, --tokensOutput <string>',
    'path to output file for tokens'
  );

program.parse();

const { tokensOutput } = program.opts<{
  readonly tokensOutput?: string;
}>();

run(input, tokensOutput).catch(console.error);

async function run(
  input: string,
  tokensOutput: string | undefined
): Promise<void> {
  const rawText = await fs.promises
    .readFile(input)
    .then((data) => data.toString());

  const { formattedErrors, tokenStream } = process(rawText);

  if (formattedErrors.length > 0) console.error(formattedErrors);
  if (typeof tokensOutput === 'string')
    await fs.promises.writeFile(tokensOutput, tokenStream);
}
