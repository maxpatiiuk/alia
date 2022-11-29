import { nameParse, run, typeCheckAst } from '../../frontEnd.js';
import { toQuads } from '../index.js';
import { testProgram } from './testProgram.js';
import { GlobalQuad } from '../definitions/GlobalQuad.js';

test('toAmd', async () => {
  const ast = await run({
    rawText: testProgram,
  });
  expect(ast).toBeDefined();
  expect(typeof nameParse(ast!, false)).toBe('string');
  expect(typeCheckAst(ast!, testProgram)).toHaveLength(0);
  const quads = toQuads(ast!);

  const globalQuad = quads[0];
  if (!(globalQuad instanceof GlobalQuad))
    throw new Error('Top level quad must be an instance of GlobalQuad');

  expect(globalQuad.convertToAmd()).toMatchSnapshot();
});
