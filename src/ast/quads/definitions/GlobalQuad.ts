import type { RA } from '../../../utils/types.js';
import { Quad } from './index.js';

export class GlobalQuad extends Quad {
  public constructor(
    private readonly globals: RA<string>,
    private readonly strings: RA<{
      readonly name: string;
      readonly value: string;
    }>
  ) {
    super();
  }

  public toString(): RA<string> {
    return [
      '[BEGIN GLOBALS]',
      ...this.globals,
      ...this.strings.flatMap(({ name, value }) => `${name} ${value}`),
      '[END GLOBALS]',
    ];
  }
}
