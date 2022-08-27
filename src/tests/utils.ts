import type { RA } from '../utils/types.js';

/**
 * Named after https://github.com/RobPethick/jest-theories
 */
export const theories = <ARGUMENTS_TYPE extends RA<unknown>, RETURN_TYPE>(
  testFunction: (...arguments_: ARGUMENTS_TYPE) => RETURN_TYPE,
  inputOutputSet: RA<readonly [ARGUMENTS_TYPE, RETURN_TYPE]>
): void =>
  describe(testFunction.name, () =>
    inputOutputSet.forEach(([input, output], index) =>
      test(`#${index}`, () => expect(testFunction(...input)).toEqual(output))
    )
  );

export const snapshots = <ARGUMENTS_TYPE extends RA<unknown>>(
  testFunction: (...arguments_: ARGUMENTS_TYPE) => unknown,
  inputs: RA<ARGUMENTS_TYPE>
): void =>
  describe(testFunction.name, () =>
    inputs.forEach((input, index) =>
      test(`#${index}`, () => expect(testFunction(...input)).toMatchSnapshot())
    )
  );
