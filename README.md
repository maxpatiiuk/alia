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
./dgc infile.dg -c 2> errors.txt
```

## Running Interpreter

Start the interpreter:

```sh
./dragoninterp
```

## Testing

Jest is used for unit testing.

You can run it like this:

```sh
make test
```