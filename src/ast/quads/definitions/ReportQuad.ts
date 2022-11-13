import type { RA } from '../../../utils/types.js';
import { Quad } from './index.js';

export class ReportQuad extends Quad {
  public constructor(private readonly quads: RA<Quad>) {
    super();
  }

  public toString() {
    return [
      ...this.quads.flatMap((quad) => quad.toString()),
      `REPORT ${this.quads.at(-1)!.toValue()}`,
    ];
  }

  public toMips(): RA<string> {
    console.warn('Warning: "output" statement is not yet implemented in MIPS');
    const lines = this.toString();
    const lastLine = lines.at(-1)!;
    const priorLines = lines.slice(0, -1);
    return [
      ...priorLines.map((line) => `# ${line.toString()}`),
      `# ${lastLine}  # Not yet implemented`,
    ];
  }

  // FIXME: convert to MIPS
}
