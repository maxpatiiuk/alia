import type { RA } from './types.js';

export function error(message: string, ...args: RA<unknown>): never {
  if (args.length > 0) console.error(...args);
  // eslint-disable-next-line functional/no-throw-statement
  throw new Error(message);
}
