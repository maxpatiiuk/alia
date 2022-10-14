import { filterArray, RA } from './types.js';
import { escapeRegExp } from './utils.js';

function parseNumber(value: string | undefined): number | undefined {
  if (value === undefined) return undefined;
  const number = Number.parseInt(value);
  return Number.isNaN(number) ? undefined : number;
}

export function getUniqueName(name: string, usedNames: RA<string>): string {
  if (!usedNames.includes(name)) return name;
  const suffix = / \((\d+)\)$/u.exec(name);
  const [{ length }, indexString] = suffix ?? ([[], '0'] as const);
  const strippedName = length > 0 ? name.slice(0, -1 * length) : name;
  const indexRegex = new RegExp(`^${escapeRegExp(strippedName)}(\\d+)$`, 'u');
  const newIndex =
    Math.max(
      ...filterArray([
        parseNumber(indexString),
        ...usedNames.map(
          (name) => parseNumber(indexRegex.exec(name)?.[1]) ?? 1
        ),
      ])
    ) + 1;
  return newIndex === 1 && length === 0
    ? strippedName
    : `${strippedName}${newIndex}`;
}
