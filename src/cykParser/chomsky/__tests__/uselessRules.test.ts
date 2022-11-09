import {
  checkValidity,
  getGrammarRoot,
  findUnreachableRules,
  removeUselessProductions,
} from '../uselessRules.js';
import { theories } from '../../../tests/utils.js';
import { epsilon } from '../../../grammar/utils.js';
import { TypeListNode } from '../../../ast/definitions/types/TypeListNode.js';

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

const ast = () => new TypeListNode([]);

describe('checkValidity', () => {
  test('unreachable rule', () =>
    expect(() =>
      checkValidity({
        a: [['c', ast]],
        c: [['c', ast]],
        b: [
          ['b', ast],
          ['a', ast],
        ],
      })
    ).toThrow(/Unreachable rule/u));

  test('infinite recursion', () =>
    expect(() => checkValidity({ a: [['a', ast]] })).toThrow(
      /is recursive with no epsilon condition/u
    ));

  const finiteRecursion = {
    a: [
      ['a', ast],
      ['b', ast],
    ],
    b: [
      [...epsilon, ast],
      ['a', ast],
    ],
    [epsilon[0]]: [['b', ast]],
  };
  test('recursive rule with indirect epsilon', () =>
    expect(checkValidity(finiteRecursion)).toEqual(finiteRecursion));

  test('name with underscore', () =>
    expect(() => checkValidity({ a_a: [['a_a', ast], []] })).toThrow(
      /must not contain underscores/u
    ));

  test('name with spaces', () =>
    expect(() => checkValidity({ 'a a': [['a a', ast], [ast]] })).toThrow(
      /must not contain spaces/u
    ));

  test('missing Syntax-Directed-Translation function', () =>
    expect(() => checkValidity({ a: [['b']], b: [['a'], []] })).toThrow(
      /needed for Syntax Directed Translation/u
    ));
});

describe('findGrammarRoot', () => {
  test('empty grammar', () =>
    expect(() => getGrammarRoot({})).toThrow('Grammar cannot be empty'));
  test('non empty grammar', () =>
    expect(getGrammarRoot({ a: [['b']], b: [['a']] })).toBe('a'));
});
