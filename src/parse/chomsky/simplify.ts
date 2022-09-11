import { removeUselessProductions } from './uselessRules.js';
import { removeUnitProductions } from './removeUnitProductions.js';
import { removeNullProductions } from './removeNullProductions.js';
import { AbstractGrammar } from '../contextFreeGrammar.js';

export const simplifyGrammar = <T extends string>(
  grammar: AbstractGrammar<T>
): AbstractGrammar<T> =>
  removeUselessProductions(
    removeUnitProductions(removeNullProductions(grammar))
  );
