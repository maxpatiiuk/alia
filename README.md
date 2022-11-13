# dgc

The ultimate Drewgon compiler and interpreter.

Written in TypeScript.

## Prerequisites

- Node 18
- NPM 8

## Installation

Install dependencies: 

```sh
make all
```

## Running Compiler

To see available options, run the script with `--help` argument:

```sh
./dgc --help
```

Example call:

```sh
./dgc infile.dg -m mips.asm 2> errors.txt
```

## Running Interpreter

Start the interpreter:

```sh
./dragoninterp
```

## Testing

Automated tests for the interpreter are located in [./src/interpreter/__tests__/runtime.test.ts](./src/interpreter/__tests__/runtime.test.ts)

Jest is used for unit testing.

You can run it like this:

```sh
make test
```

## Generate a graph

There is an option to create a graph of the processed grammar (could be useful
for debugging)

> NOTE: due to grammar being quite large, the resulting graph is enormous

First, create a `parser.dot` text file (in the DOT format):

```
./dgc --diagramPath parser.dot
```

Then, convert it into a `parser.svg` image (assuming dot is installed):

```sh
dot -Tsvg parser.dot -o parser.svg
```

Tested with `dot v6.0.1`