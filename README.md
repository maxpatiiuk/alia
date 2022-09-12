# dgc

The ultimate Drewgon compiler.

Written in TypeScript.

> NOTE: at present this project only includes a tokenizer and a parser

## Prerequisites

- Node 18
- NPM 8

## Installation

Install dependencies: 

```sh
make
```

## Running

To see available options, run the script with `--help` argument:

```sh
./dgc --help
```

Example call:

```sh
./dgc file.dg -p
```

## Testing

Jest is used for unit testing.

You can run it like this:

```sh
make test
```