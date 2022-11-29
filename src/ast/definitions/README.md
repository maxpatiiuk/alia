# AST node definitions

All AST nodes are defined in this directory.

Each AST node extends the `AstNode` class.

There are also some subclasses:

- [Expression](./expression/index.ts)
- [Statement](./statement/index.ts)
  - [Line Statement](./statement/line/index.ts)
  - [Block Statement](./statement/block/index.ts)
- [Term](./term/index.ts)
- [Type](./types/index.ts)