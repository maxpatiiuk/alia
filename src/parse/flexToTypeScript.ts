/**
 * This helper script was used to convert flex grammar to TypeScript object
 */

const yyGrammar = 'put your flex grammar here';
const rules = Array.from(
  yyGrammar.matchAll(
    /(?<entry>^[a-z][A-Za-z]+)\\s+::=\\s*(?<entries>[S\\s]*?)\\n\\n/gmu
  ),
  ({ groups = {} }) =>
    [
      groups.entry,
      groups.entries.split('|').map((v) => v.trim().split(' ')),
    ] as const
);
const typeScriptString = rules
  .map(
    ([v, entries]) =>
      `${v}:[${entries.map(
        (v) =>
          `[${v
            .filter(Boolean)
            .map((v) => `'${v}'`)
            .join(',')}]`
      )}]`
  )
  .join(',\\n');

console.log(`{${typeScriptString}}`);

export {};
