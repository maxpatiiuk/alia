import { Quad } from './index.js';

export class GoToQuad extends Quad {
  public constructor(private readonly label: string) {
    super();
  }

  public toString() {
    return [`goto ${this.label}`];
  }
}
