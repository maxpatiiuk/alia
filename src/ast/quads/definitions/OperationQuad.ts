import type { RA } from '../../../utils/types.js';
import { AssignQuad } from './AssignQuad.js';
import { Quad } from './index.js';
import { TermQuad } from './TermQuad.js';

const operationTranslations = {
  '--': 'SUB64',
  '++': 'ADD64',
  '+': 'ADD64',
  '-': 'SUB64',
  '*': 'MULT64',
  '/': 'DIV64',
  or: 'OR64',
  and: 'AND64',
  eq: 'EQ64',
  '<': 'LT64',
  '>': 'GT64',
  '<=': 'LTE64',
  '>=': 'GTE64',
  neg: 'NEG64',
  '!': 'NOT64',
  '==': 'EQ64',
  '!=': 'NEQ64',
} as const;

export class OpQuad extends TermQuad {
  public constructor(
    left: string,
    type: keyof typeof operationTranslations,
    right: string
  ) {
    super(
      `${left === '' ? '' : `${left} `}${operationTranslations[type]} ${right}`
    );
  }
}

export class OperationQuad extends Quad {
  private readonly assignQuad: AssignQuad;

  public constructor(
    private readonly left: RA<Quad> | undefined,
    type: keyof typeof operationTranslations,
    private readonly right: RA<Quad>,
    tempName: string
  ) {
    super();

    const opQuad = new OpQuad(
      this.left?.at(-1)!.toValue() ?? '',
      type,
      this.right.at(-1)!.toValue()
    );
    this.assignQuad = new AssignQuad(tempName, [opQuad]);
  }

  public toString() {
    return [
      ...(this.left ?? []).flatMap((quad) => quad.toString()),
      ...this.right.flatMap((quad) => quad.toString()),
      ...this.assignQuad.toString(),
    ];
  }

  public toValue() {
    return this.assignQuad.toValue();
  }
}
