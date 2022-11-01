import { createInterface } from 'node:readline/promises';

import { runtime } from './runtime.js';

const stream = createInterface({
  input: process.stdin,
  output: process.stdout,
});
console.log(
  'Welcome to dragoninterp!\n' +
    'Enter Drewgon code to be interpreted\n' +
    'Enter :help for help\n'
);

stream.on('close', () => process.exit());

runtime(stream).catch(console.error);
