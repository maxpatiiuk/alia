import { program } from 'commander';
import fs from 'node:fs';

import type { PrintContext } from './ast/definitions.js';
import { namedParse, run } from './process.js';

program.name('dgc').description('The ultimate Drewgon compiler');

let input = '';

/*
 * FIXME: re-read the error reporting guidelines
 * FIXME: enforce operator precedence
 * FIXME: re-read the project spec just in case
 */

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

const readFile = async (): Promise<string> =>
  fs.promises.readFile(input).then((data) => data.toString());

readFile()
  .then(async (rawText) => {
    const ast = await run(
      rawText,
      tokensOutput,
      unparseOutput,
      debug,
      parser,
      unparseMode
    );

    if (typeof namedUnparse === 'string' && typeof ast === 'object') {
      const printContext: PrintContext = {
        indent: 0,
        mode: 'pretty',
        debug,
        needWrapping: false,
      };

      const namedUnparseResults = namedParse(rawText, ast, printContext);
      if (namedUnparseResults === undefined) return;
      if (Array.isArray(namedUnparseResults)) {
        namedUnparseResults.forEach((errorMessage) =>
          console.error(errorMessage)
        );
        console.error('Name Analysis Failed');
      } else await fs.promises.writeFile(namedUnparse, namedUnparseResults);
    }
  })
  .catch(console.error);
