import { mipsSize, Quad } from './index.js';

export class PushQuad extends Quad {
  public constructor(
    private readonly tempRegister: string,
    private readonly comment?: string
  ) {
    super();
  }

  public toString() {
    return [];
  }

  public toMips() {
    return [
      `addi $sp, $sp, -${mipsSize}${
        typeof this.comment === 'string' ? `  # ${this.comment}` : ''
      }`,
      `sw ${this.tempRegister}, 0($sp)`,
    ];
  }
}

/*
export class PushQuad extends Quad {
  private readonly intQuad: Quad;
  
  public constructor(
    private readonly name: string,
    value: string,
    tempRegister: string,
  ) {
    super();
    this.intQuad = new IntLiteralQuad(value, tempRegister);
  }

  public toString() {
    return [];
  }
  public toMips() {
    return [
      `sub $sp, $sp, ${mipsSize}  # push ${this.name} to the stack`,
      ...this.intQuad.toMips(),
      `sw ${this.intQuad.toMipsValue()}, 0($sp)`,
    ];
  }
}*/
