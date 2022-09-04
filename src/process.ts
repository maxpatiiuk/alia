import { formatErrors } from './formatErrors.js';
import { formatTokens } from './formatTokens.js';
import type { ParseError, ParseTreeNode } from './parse/index.js';
import { parse } from './parse/index.js';
import { tokenize } from './tokenize/index.js';
import { cretePositionResolver } from './utils/resolvePosition.js';
import type { RA } from './utils/types.js';

export function process(rawText: string): {
  readonly formattedErrors: string;
  readonly tokenStream: string;
  readonly parseTree: ParseTreeNode | undefined;
  readonly parseErrors: RA<ParseError>;
} {
  const { tokens, syntaxErrors } = tokenize(rawText, 0);

  const positionResolver = cretePositionResolver(rawText);

  const { parseTree, parseErrors } = parse(tokens);

  return {
    formattedErrors: formatErrors(syntaxErrors, positionResolver),
    tokenStream: formatTokens(tokens, positionResolver),
    parseTree,
    parseErrors,
  };
}
