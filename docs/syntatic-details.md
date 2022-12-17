# Syntactic Details

> This document was originally hosted at https://compilers.cool/language/
> and was written by Drew Davidson from the University of Kansas.

This section described the syntax of the Alia language.

## Basics

The basic syntax of Alia is designed to evoke a simplified variant C. Alia
is a block-structured language, with most blocks delimited by curly braces.
Variables and functions may be declared in the global scope, most statements and
declarations are delimited semicolons.

## Notable Differences from C

While the canonical reference for Alia syntax is its context-free grammar,
there are a couple of "standout" points which deserve special attention for
their deviation from C:

- Declarations are not allowed to have initializers. Thus, `int answer = 42;` is
  illegal in Alia. Instead, initialization must be a separate statement,
  i.e. `int answer; answer = 1;`.
- Statements besides declarations are not allowed in the global scope (i.e.
  outside of a function body). Thus

  ```c
  int i;
  i = 4;
  ```

  is not a legal program, but

  ```c
  int i;
  void function(){
    i = 4;
  }
  ```

  is legal.

- Variables can have a function type. For example,

  ```c
  int a(int arg){ }
  int b(int arg){ }
  int main(){
  	fn (int)->int functionRef;
  	functionRef = a;
  	functionRef(1);
  	functionRef = b;
  	functionRef(2);
  }
  ```

  Is a legal program.

* There are no input/output streams, and no stream operators. Instead of writing
  code like `std::cout << "hello";` or `std::cin >> age`, Alia uses
  the `output` and `input` tokens, respectively. Thus, you'd write code
  like `output "hello";` or `input age;`.

## Context-Free Grammar for Alia

Grammar for Alia programs:

```yaml
program         ::= globals

globals         ::= globals varDecl SEMICOL
                |   globals fnDecl
                | /* epsilon */

varDecl         ::= type id

type            ::= primType
                |   FN fnType

primType        ::= INT
                |   BOOL
                |   VOID

fnType          ::= LPAREN typeList RPAREN ARROW type
                |   LPAREN RPAREN ARROW type

typeList        ::= type
                |   typeList COMMA type

fnDecl          ::= type id LPAREN RPAREN LCURLY stmtList RCURLY
                |   type id LPAREN formals RPAREN LCURLY stmtList RCURLY

formals         ::= formalDecl
                | formals COMMA formalDecl

formalDecl	::= type id

stmtList        ::= stmtList stmt SEMICOL
                |   stmtList blockStmt
                |   /* epsilon */

blockStmt       ::= WHILE LPAREN exp RPAREN LCURLY stmtList RCURLY
                | FOR LPAREN stmt SEMICOL exp SEMICOL stmt RPAREN LCURLY stmtList RCURLY
                | IF LPAREN exp RPAREN LCURLY stmtList RCURLY
                | IF LPAREN exp RPAREN LCURLY stmtList RCURLY ELSE LCURLY stmtList RCURLY

stmt            ::= varDecl
                | assignExp
                | id POSTDEC
                | id POSTINC
                | INPUT id
                | OUTPUT exp
                | RETURN exp
                | RETURN
                | callExp

exp             ::= assignExp
                | exp MINUS exp
                | exp PLUS exp
                | exp TIMES exp
                | exp DIVIDE exp
                | exp AND exp
                | exp OR exp
                | exp EQUALS exp
                | exp NOTEQUALS exp
                | exp GREATER exp
                | exp GREATEREQ exp
                | exp LESS exp
                | exp LESSEQ exp
                | NOT exp
                | MINUS term
                | term

assignExp       ::= id ASSIGN exp

callExp         ::=  id LPAREN RPAREN   // fn call with no args
                | id LPAREN actualsList RPAREN  // with args

actualsList     ::= exp
                | actualsList COMMA exp
                

term            ::= id
                | INTLITERAL
                | STRINGLITERAL
                | TRUE
                | FALSE
                | LPAREN exp RPAREN
                | callExp
                | MAYHEM

id              ::= ID
```
