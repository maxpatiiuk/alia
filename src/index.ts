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
  .option('-p, --print', 'parse the input to check syntax');

program.parse();

run(input).catch(console.error);

async function run(input: string): Promise<void> {
  const rawText = await fs.promises
    .readFile(input)
    .then((data) => data.toString());

  const { formattedErrors, parseResult } = process(rawText);

  if (formattedErrors.length > 0) console.error(formattedErrors);
  else if (!parseResult) console.error('syntax error\nParse failed');
}
