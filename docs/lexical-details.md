# Lexical Details

> This document was originally hosted at https://compilers.cool/language/
> and was written by Drew Davidson from the University of Kansas.

This section defines lexical details of the Alia language.

## Reserved Words

The following words are considered _reserved_, and should be yield a distinct
token (rather than be counted as an identifier).

```
int fn bool void mayhem
if else while for return
output input true false or and
```

## Identifiers

Any sequence of one or more letters and/or digits, and/or underscores, starting
with a letter or underscore, should be treated as an identifier token.
Identifiers must not be reserved words, but may include a proper substring that
is a reserved word, e.g. `while1` is an identifier but `while` is not.

## Integer Literals

Any sequence of of one or more digits yields an integer literal token as long as
it is not part of an identifer or string.

## String Literals

Any string literal (a sequence of zero or more _string_ characters surrounded by
double quotes) should yield a string literal token. A _string_ character is
either

- an escaped character: a backslash followed by any one of the following
  characters:
    1. n
    2. t
    3. a double quote
    4. another backslash
- a single character other than newline or double quote or backslash.

Examples of legal string literals:

- `""`
- `"&!88"`
- `"use \\n to denote a newline character"`
- `"use \\" to  for a quote and \\\\ for a backslash"`

Examples of things that are **not** legal string literals:

- `"unterminated`
- `"also unterminated \\"`
- `"backslash followed by space: \\ is not allowed"`
- `"bad escaped character: \\a AND not terminated`

## Symbol Operators

Any of the following one- or two-character symbols constitute a distinct token:

```
{   }   (   )   ;  ->
,  --   -   +   \*  =
!  /  ++    ==   !=   
<    >    <=     >=    
```

## Comments

Text starting with two slashes (//) up to the end of the line is a comment (
except of course if those characters are inside a string literal). For example:

```
// this is a comment
// and so is // this
// and so is this %$!#
```

The scanner should recognize and ignore comments (there is no COMMENT token).

## Whitespace

Spaces, tabs, and newline characters are whitespace. Whitespace separates tokens
and changes the character counter, but should otherwise be ignored (except
inside a string literal).

## Illegal Characters

Any character that is not whitespace and is not part of a token or comment is
illegal.

## Length Limits

No limit may be assumed on the lengths of identifiers, string literals, integer
literals, comments, etc. other than those limits imposed by the underlying
implementation of the compiler's host language.

## Which Token to Produce

For the most part, the token to produce should be self-explanatory. For example,
the `+` symbol should produce the `PLUS` token, the `-` symbol should produce
the `MINUS` token, etc. The set of tokens can be found in `grammar.hh` or in the
switch in `tokens.cpp`. The `LCURLY` token refers to a left curly brace, `{`.
the `RCURLY` refers to a right curly brace, `}`.

The lexical structure of Alia is very similar to C, with a couple of
extensions:

- The string `->` produces the `ARROW` token.
- The strings `output`, `input`, `mayhem`, and `fn` are keywords of the
  language, and produce `INPUT`, `OUTPUT`, `MAYHEM`, and `FN` respectively.
- The string `&&` and `||` are NOT in the language . Instead "logical and" is
  represented by the string `and` and "logical or" is represented by the
  string `or`.
