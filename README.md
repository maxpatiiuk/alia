# dgc

The ultimate Drewgon compiler.

Written in TypeScript.

> NOTE: at present this project only includes a tokenizer, parser and a formatter

## Prerequisites

- Node 18
- NPM 8

## Installation

Install dependencies: 

```sh
make all
```

## Running

To see available options, run the script with `--help` argument:

```sh
./dgc --help
```

Example call:

```sh
./dgc infile.dg -c 2> errors.txt
```

## Testing

Jest is used for unit testing.

You can run it like this:

```sh
make test
```