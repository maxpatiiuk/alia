import { AbstractGrammar } from '../contextFreeGrammar.js';
import { isToken } from '../../tokenize/definitions.js';

export function removeUnitProductions<T extends string>(
  grammar: AbstractGrammar<T>
): AbstractGrammar<T> {
  let changed = false;
  const newGrammar = Object.fromEntries(
    Object.entries(grammar).map(([name, lines]) => [
      name,
      lines.flatMap((line) => {
        if (line.length === 1 && !isToken(line[0])) {
          changed = true;
          return grammar[line[0]];
        } else return [line];
      }),
    ])
  );
  return changed ? removeUnitProductions(newGrammar) : newGrammar;
}
