import { program } from 'commander';
import fs from 'node:fs';

import { formatErrors } from './formatErrors.js';
import { formatTokens } from './formatTokens.js';
import { tokenize } from './tokenize/index.js';
import { cretePositionResolver } from './utils/resolvePosition.js';

program.name('dgc').description('The ultimate Drewgon compiler');

let input = '';

program
  .argument('<input>', 'path to input file')
  .action((inputString: string) => {
    input = inputString;
  })
  .requiredOption(
    '-t, --tokensOutput <string>',
    'path to output file for tokens'
  );

program.parse();

const { tokensOutput } = program.opts<{
  readonly tokensOutput: string;
}>();

run(input, tokensOutput).catch(console.error);

async function run(input: string, tokensOutput: string): Promise<void> {
  const rawText = await fs.promises
    .readFile(input)
    .then((data) => data.toString());
  const { tokens, errors } = tokenize(rawText, 0);

  const positionResolver = cretePositionResolver(rawText);
  const formattedErrors = formatErrors(errors, positionResolver);
  if (formattedErrors.length > 0) console.error(formattedErrors);

  const output = formatTokens(tokens, positionResolver);
  await fs.promises.writeFile(tokensOutput, output);
}
