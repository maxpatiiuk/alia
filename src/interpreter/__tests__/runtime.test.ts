import type { Interface } from 'node:readline/promises';

import type { RA } from '../../utils/types.js';
import { runtime } from '../runtime.js';

const reSpecialLine = /^(> |\. )(.+)$/gmu;
const processLines = (line: string): RA<string> =>
  line.replaceAll(reSpecialLine, '$1\n$2').split('\n');

/**
 * Give some input to the interpreter line by line and assert the output
 * matched the expected output.
 *
 * This is creating a fake IO stream object to fool the interpreter code into
 * using a mocked IO stream.
 */
async function fakeInterpreter(commands: string): Promise<void> {
  const lines = processLines(commands);
  let position = 0;
  const stream = {
    question: async (prompt: string): Promise<string> => {
      if (prompt.length > 0) console.log(prompt);
      const output = lines[position];
      position += 1;
      return output;
    },
    close: (): void => {
      if (position === lines.length)
        throw new Error('Expected more input, but got EOF');
    },
  } as unknown as Interface;

  jest.spyOn(console, 'log').mockImplementation((output) => {
    expect(output).toEqual(lines[position]);
    position += 1;
  });
  jest.spyOn(console, 'error').mockImplementation((output) => {
    expect(output).toEqual(lines[position]);
    position += 1;
  });
  return runtime(stream);
}

test('Interpreter', async () =>
  fakeInterpreter(`
int a
0

input a
> 4
4

output a * 2
8
undefined

int loop(int until) {
.  output until;
.  for(int i; i<until; i++) {
.    output i;
.  }
. }
(int->int)

loop(4)
4
0
1
2
3
undefined

int do() {
.  while(true) {
.    int i;
.    input i;
.    if(i == 0) { return 5; }
.    else { output i + 4 / 2; }
.  }
. }
(->int)

output do();
> 3
5
> 2
4
> 0
5
undefined

int do(fn ()->int f) {
.   output f();
.   output f();
. }
(->int->int)

int val() {
.   return 4;
. }
(->int)

val;
(->int)

do(val);
4
4
undefined

return
undefined
`));
