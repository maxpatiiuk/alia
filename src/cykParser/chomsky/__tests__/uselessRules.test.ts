import { epsilon } from '../../contextFreeGrammar.js';
import {
  checkValidity,
  getGrammarRoot,
  findUnreachableRules,
  removeUselessProductions,
} from '../uselessRules.js';
import { theories } from '../../../tests/utils.js';

theories(removeUselessProductions, [
  {
    in: [{ a: [['a'], ['b']], b: [['b']] }],
    out: { a: [['a'], ['b']], b: [['b']] },
  },
  {
    in: [{ a: [['a', 'b']], b: [['b']] }],
    out: { a: [['a', 'b']], b: [['b']] },
  },
  {
    in: [{ a: [['a']], b: [['b']] }],
    out: { a: [['a']] },
  },
]);

theories(findUnreachableRules, [
  {
    in: [{ a: [['a']], b: [['b']] }],
    out: ['b'],
  },
  {
    name: 'root is considered reachable',
    in: [{ a: [['a']] }],
    out: [],
  },
]);

describe('checkValidity', () => {
  test('unreachable rule', () =>
    expect(() =>
      checkValidity({
        a: [['c']],
        c: [['c']],
        b: [['b'], ['a']],
      })
    ).toThrow(/Unreachable rule/u));

  test('infinite recursion', () =>
    expect(() => checkValidity({ a: [['a']] })).toThrow(
      /is recursive with no epsilon condition/u
    ));

  const finiteRecursion = {
    a: [['a'], ['b']],
    b: [epsilon, ['a']],
    [epsilon[0]]: [['b']],
  };
  test('recursive rule with indirect epsilon', () =>
    expect(checkValidity(finiteRecursion)).toEqual(finiteRecursion));

  test('name with underscore', () =>
    expect(() => checkValidity({ a_a: [['a_a'], []] })).toThrow(
      /must not contain underscores/u
    ));

  test('name with spaces', () =>
    expect(() => checkValidity({ 'a a': [['a a'], []] })).toThrow(
      /must not contain spaces/u
    ));
});

describe('findGrammarRoot', () => {
  test('empty grammar', () =>
    expect(() => getGrammarRoot({})).toThrow('Grammar cannot be empty'));
  test('non empty grammar', () =>
    expect(getGrammarRoot({ a: [['b']], b: [['a']] })).toBe('a'));
});
