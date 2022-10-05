import { removeUselessProductions } from './uselessRules.js';
import { removeUnitProductions } from './removeUnitProductions.js';
import { removeNullProductions } from './removeNullProductions.js';
import {PureGrammar} from '../../grammar/utils.js';

export const simplifyGrammar = <T extends string>(
  grammar: PureGrammar<T>
): PureGrammar<T> =>
  removeUselessProductions(
    removeUnitProductions(removeNullProductions(grammar))
  );
