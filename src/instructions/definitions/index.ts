/**
 * Base instruction class
 *
 * As you can see, this abstraction layer is very thin, yet very helpful for
 * simplifying optimization and reducing typos.
 */

export class Instruction {
  public label: string | undefined;

  public toString(): string {
    throw new Error('Not implemented');
  }
}
