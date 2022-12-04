import { nameParse, run, typeCheckAst } from '../../frontEnd.js';
import { toQuads } from '../index.js';
import { testProgram } from './testProgram.js';

test('toQuads', async () => {
  const ast = await run({
    rawText: testProgram,
  });
  expect(ast).toBeDefined();
  expect(typeof nameParse(ast!, false)).toBe('string');
  expect(typeCheckAst(ast!, testProgram)).toHaveLength(0);
  const quads = toQuads(ast!);

  expect(quads.flatMap((quad) => quad.toString()).join('\n')).toMatchSnapshot();
});
