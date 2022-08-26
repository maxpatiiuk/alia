import type { RR } from '../utils/types.js';

export type Tokens = {
  readonly AND: RR<never, never>;
  readonly ARROW: RR<never, never>;
  readonly ASSIGN: RR<never, never>;
  readonly BOOL: RR<never, never>;
  readonly COMMA: RR<never, never>;
  readonly DIVIDE: RR<never, never>;
  readonly ELSE: RR<never, never>;
  readonly END: RR<never, never>;
  readonly EQUALS: RR<never, never>;
  readonly FALSE: RR<never, never>;
  readonly FN: RR<never, never>;
  readonly FOR: RR<never, never>;
  readonly GREATER: RR<never, never>;
  readonly GREATEREQ: RR<never, never>;
  readonly ID: {
    readonly literal: string;
  };
  readonly IF: RR<never, never>;
  readonly INPUT: RR<never, never>;
  readonly INT: RR<never, never>;
  readonly INTLITERAL: {
    readonly literal: number;
  };
  readonly LCURLY: RR<never, never>;
  readonly LESS: RR<never, never>;
  readonly LESSEQ: RR<never, never>;
  readonly LPAREN: RR<never, never>;
  readonly MINUS: RR<never, never>;
  readonly MAYHEM: RR<never, never>;
  readonly NOT: RR<never, never>;
  readonly NOTEQUALS: RR<never, never>;
  readonly OR: RR<never, never>;
  readonly OUTPUT: RR<never, never>;
  readonly PLUS: RR<never, never>;
  readonly POSTDEC: RR<never, never>;
  readonly POSTINC: RR<never, never>;
  readonly RETURN: RR<never, never>;
  readonly RCURLY: RR<never, never>;
  readonly RPAREN: RR<never, never>;
  readonly SEMICOL: RR<never, never>;
  readonly STRINGLITERAL: {
    readonly literal: string;
  };
  readonly TIMES: RR<never, never>;
  readonly TRUE: RR<never, never>;
  readonly VOID: RR<never, never>;
  readonly WHILE: RR<never, never>;
};

/**
 * When printing, some tokens should be renamed.
 * All tokens not mentioned here would use the default name
 */
export const tokenLabels: Partial<RR<keyof Tokens, string>> = {
  STRINGLITERAL: 'STRINGLIT',
  INTLITERAL: 'INTLIT',
  END: 'EOF',
} as const;
