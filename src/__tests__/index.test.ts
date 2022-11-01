import { nameParse, run, typeCheckAst } from '../process.js';
import type { RA } from '../utils/types.js';

async function nameAnalysis(
  input: string
): Promise<RA<string> | string | undefined> {
  const ast = await run(input, undefined, undefined, false, 'SLR', 'ast');
  if (ast === undefined) return undefined;
  return nameParse(ast, false);
}

describe('name analysis', () => {
  test('simple case without errors', async () =>
    expect(nameAnalysis(`int a;`)).resolves.toBe('int a(int);'));

  test('simple case with errors', async () =>
    expect(
      nameAnalysis(`int a;
void a;
`)
    ).resolves.toEqual([
      'FATAL [2,6]-[2,7]: Invalid type in declaration',
      'FATAL [2,6]-[2,7]: Multiply declared identifier',
    ]));

  test('advanced cases with errors', async () =>
    expect(
      nameAnalysis(`int a;
int b;

bool c;
void d;

int bar(int b, int _3d){
 int a;
}

void bar(){
 int a;
}

fn() -> void bar() {
 int b;
}

fn(int, fn () -> fn () -> void) -> void bar() {
 int b;

 while(-a) {

 }

 // for(int a; int b; int c) {
 //
 // }

 for(int a; TRUE and true; int c) {

 }

 if(false) {}

 if(3 * 4 == 42) {} else {
   // test
 }

  if(a){if(a){if(a){if(a){if(a){if(a){if(a){if(a){if(a){if(a){if(a){pikachu++;}}}}}}}}}}}

  val = 4;

  val--;
  val++;

  return;
  return 4;
  output 10;
  input des;
  output 10*4;
  if(((10 != true)) or 10 <= 4) {}
  output 10 < 4;

  some();
  some(do, 10 - 4);

  output FALSE;
  output 10;
  output "Test\\n\\t";
}
`)
    ).resolves.toEqual([
      'FATAL [5,6]-[5,7]: Invalid type in declaration',
      'FATAL [11,6]-[11,9]: Multiply declared identifier',
      'FATAL [15,14]-[15,17]: Multiply declared identifier',
      'FATAL [19,41]-[19,44]: Multiply declared identifier',
      'FATAL [30,13]-[30,17]: Undeclared identifier',
      'FATAL [40,69]-[40,76]: Undeclared identifier',
      'FATAL [42,3]-[42,6]: Undeclared identifier',
      'FATAL [44,3]-[44,6]: Undeclared identifier',
      'FATAL [45,3]-[45,6]: Undeclared identifier',
      'FATAL [50,9]-[50,12]: Undeclared identifier',
      'FATAL [55,3]-[55,7]: Undeclared identifier',
      'FATAL [56,3]-[56,7]: Undeclared identifier',
      'FATAL [56,8]-[56,10]: Undeclared identifier',
      'FATAL [58,10]-[58,15]: Undeclared identifier',
    ]));
  test('complex case without errors', async () =>
    expect(
      nameAnalysis(`int a;
int b;

bool c;
bool d;

int bar(int b, int _3d){
 a();
 int a;
 a();
}

void baz(){
 int a;
}

fn() -> void baq() {
 int b;
}

fn(int, fn () -> fn () -> void) -> void biz() {
 int b;

 while(-a) {

 }

 // for(int a; int b; int c) {
 //
 // }

 int TRUE;
 for(int a; TRUE and true; int c) {

 }

 if(false) {}

 if(3 * 4 == 42) {} else {
   // test
 }

  int a;
  int pikachu;
  if(a){if(a){if(a){if(a){if(a){if(a){if(a){if(a){if(a){if(a){if(a){pikachu++;}}}}}}}}}}}

  int val;
  val = 4;

  val--;
  val++;

  int des;
  return;
  return 4;
  output 10;
  input des;
  output 10*4;
  if(((10 != true)) or 10 <= 4) {}
  output 10 < 4;

  bool FALSE;
  baz();
  bar(val, 10 - 4);

  output FALSE;
  output 10;
  output "Test\\n\\t";
}`)
    ).resolves.toBe(`int a(int);
int b(int);
bool c(bool);
bool d(bool);
int bar(int,int->int)(int b(int), int _3d(int)){
    a(int)();
    int a(int);
    a(int)();
}
void baz(->void)(){
    int a(int);
}
fn ()->void baq(->->void)(){
    int b(int);
}
fn (int, fn ()->fn ()->void)->void biz(->int,->->void->void)(){
    int b(int);
    while (-a(int)){
    }
    int TRUE(int);
    for (int a(int); TRUE(int) and true; int c(int)){
    }
    if (false){
    }
    if ((3 * 4) == 42){
    } else {
    }
    int a(int);
    int pikachu(int);
    if (a(int)){
        if (a(int)){
            if (a(int)){
                if (a(int)){
                    if (a(int)){
                        if (a(int)){
                            if (a(int)){
                                if (a(int)){
                                    if (a(int)){
                                        if (a(int)){
                                            if (a(int)){
                                                pikachu(int)++;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    int val(int);
    val(int) = 4;
    val(int)--;
    val(int)++;
    int des(int);
    return;
    return 4;
    output 10;
    input des(int);
    output 10 * 4;
    if ((10 != true) or (10 <= 4)){
    }
    output 10 < 4;
    bool FALSE(bool);
    baz(->void)();
    bar(int,int->int)(val(int), 10 - 4);
    output FALSE(bool);
    output 10;
    output "Test\\n\\t";
}`));
  test('operator precedence is followed', async () =>
    expect(
      nameAnalysis(`int bar() {
  int a;
  if(a or 1 <= 2) {}
}
`)
    ).resolves.toBe(`int bar(->int)(){
    int a(int);
    if (a(int) or (1 <= 2)){
    }
}`));
});

const input = `int a;
int b;

bool c;
bool d;

int bar(int b, int _3d){
 a();
 int a;
 a();
}

void baz(){
 int a;
}

fn() -> void baq() {
 int b;
}

fn(int, fn () -> fn () -> void) -> void biz() {
 int b;

 while(-a) {

 }

 // for(int a; int b; int c) {
 //
 // }

 int TRUE;
 for(int a; TRUE and true; int c) {

 }

 if(false) {}

 if(3 * 4 == 42) {} else {
   // test
 }

  int a;
  int pikachu;
  if(a){if(a){if(a){if(a){if(a){if(a){if(a){if(a){if(a){if(a){if(a){pikachu++;}}}}}}}}}}}

  int val;
  val = 4;

  val--;
  val++;

  int des;
  return;
  return 4;
  output 10;
  input des;
  output 10*4;
  if(((10 != true)) or 10 <= 4) {}
  output 10 < 4;

  bool FALSE;
  baz();
  bar(val, 10 - 4);

  output FALSE;
  output 10;
  output "Test\\n\\t";
}

void voidFunction() {
  int a;
  while(a=3) {}

  bool b;
  while(b=true) {}

  output voidFunction();
  output biz();
  output bar();

  //for(int a; a<7; i++) {
  //  int i;
  //}

  return voidFunction();
  return;
  return voidFunction;
  return a;
}

bool boolFunction() {
  return;
  return boolFunction();
  return boolFunction;

}

fn()->void fnFnFn(fn()->void voidFunction, fn()->int intFunction) {
  return voidFunction;
  return;
}

int intFunction() {
  return voidFunction();

  int Int;
  bool Bool;

  if(Int == Int) {}
  if(Int == Bool) {}
  if(Int != Bool) {}
  if(Bool != Bool) {}
  if(intFunction() != Bool) {}
  if(intFunction() != intFunction()) {}
  if(voidFunction() != voidFunction()) {}
  if(intFunction != intFunction) {}
  Int = Int + 1;
  Int = Int - 1;
  Int = Int * 1;
  Int = Int / 1;
  Int++;
  Int--;
  Bool++;
  Bool--;
  Int = Bool;
  Int = Bool + 1;
  Int = Bool - 1;
  Int = Bool * 1;
  Int = Bool / 1;
  Bool = Bool + 1;
  Bool = Bool - 1;
  Bool = Bool * 1;
  Bool = Bool / 1;
  if(Int > Int) {}
  if(Int < Int) {}
  if(Int <= Int) {}
  if(Int >= Int) {}
  if(Bool > Int) {}
  if(Bool < Int) {}
  if(Bool <= Int) {}
  if(Bool >= Int) {}
  if(Bool > Bool) {}
  if(Bool < Bool) {}
  if(Bool <= Bool) {}
  if(Bool >= Bool) {}

  if(intFunction >= Bool) {}
  if(intFunction >= voidFunction()) {}
  if(intFunction() >= Int) {}

  if(intFunction or Bool) {}
  if(intFunction and voidFunction()) {}
  if(intFunction() or Int) {}

  intFunction = Int;
  intFunction = intFunction;
  intFunction = intFunction();
  voidFunction = Int;
  voidFunction = voidFunction;
  voidFunction = voidFunction();
  if(Int = Bool) {}
  if(Int = Int) {}
  if(Bool = Bool) {}
  input Int;
  input Bool;
  input voidFunction;
  input intFunction;
  output Int;
  output intFunction;
  output voidFunction;
  output voidFunction();
  output "abc";
  Int();
  Bool();
  intFunction();

  fn()->int intFunctionType;
  fn()->void voidFunction;
  intFunctionType = intFunction;
  intFunctionType = voidFunction;
  intFunctionType = intFunction();
  intFunctionType = voidFunction();
  if(boolFunction()) {}

  fnFnFn();
  fnFnFn(intFunction);
  fnFnFn(intFunction, voidFunction);
  fnFnFn(voidFunction, intFunction);
  fnFnFn(Int, Bool);

  Int = voidFunction() + 1;
  Int = intFunction() + 1;

  return;
  return Int;
  return Bool;

  if(Int) {}
  if(intFunction) {}
  if(voidFunction()) {}

  for(int a; intFunction(); a++) {}
  for(int a; voidFunction(); a++) {}
  for(int a; voidFunction; a++) {}

  while(intFunction()) {}
  while(voidFunction()) {}
  while(voidFunction) {}
  while("bar") {}
  while(1) {}
  while(Bool = Bool) {}
}`;

async function typeCheck(
  input: string
): Promise<RA<string> | string | undefined> {
  const ast = await run(input, undefined, undefined, false, 'SLR', 'ast');
  if (ast === undefined) return undefined;
  const nameErrors = nameParse(ast, false);
  return Array.isArray(nameErrors) ? nameErrors : typeCheckAst(ast, input);
}

test('typeCheckAst', async () =>
  expect(typeCheck(input)).resolves.toEqual([
    'FATAL [8,2]-[8,3]: Attempt to call a non-function',
    'FATAL [10,2]-[10,3]: Attempt to call a non-function',
    'FATAL [24,8]-[24,10]: Non-bool expression used as a loop condition',
    'FATAL [33,13]-[33,17]: Logical operator applied to non-bool operand',
    'FATAL [45,6]-[45,7]: Non-bool expression used as an if condition',
    'FATAL [45,12]-[45,13]: Non-bool expression used as an if condition',
    'FATAL [45,18]-[45,19]: Non-bool expression used as an if condition',
    'FATAL [45,24]-[45,25]: Non-bool expression used as an if condition',
    'FATAL [45,30]-[45,31]: Non-bool expression used as an if condition',
    'FATAL [45,36]-[45,37]: Non-bool expression used as an if condition',
    'FATAL [45,42]-[45,43]: Non-bool expression used as an if condition',
    'FATAL [45,48]-[45,49]: Non-bool expression used as an if condition',
    'FATAL [45,54]-[45,55]: Non-bool expression used as an if condition',
    'FATAL [45,60]-[45,61]: Non-bool expression used as an if condition',
    'FATAL [45,66]-[45,67]: Non-bool expression used as an if condition',
    'FATAL [54,3]-[54,9]: Missing return value',
    'FATAL [55,10]-[55,11]: Bad return value',
    'FATAL [59,8]-[59,18]: Invalid equality operation',
    'FATAL [73,9]-[73,12]: Non-bool expression used as a loop condition',
    'FATAL [78,10]-[78,24]: Attempt to output void',
    'FATAL [79,10]-[79,15]: Attempt to output a function',
    'FATAL [80,10]-[80,15]: Function call with wrong number of args',
    'FATAL [86,10]-[86,24]: Return with a value in void function',
    'FATAL [88,10]-[88,22]: Return with a value in void function',
    'FATAL [89,10]-[89,11]: Return with a value in void function',
    'FATAL [93,3]-[93,9]: Missing return value',
    'FATAL [95,10]-[95,22]: Bad return value',
    'FATAL [101,3]-[101,9]: Missing return value',
    'FATAL [105,10]-[105,24]: Bad return value',
    'FATAL [111,6]-[111,17]: Invalid equality operation',
    'FATAL [112,6]-[112,17]: Invalid equality operation',
    'FATAL [114,6]-[114,27]: Invalid equality operation',
    'FATAL [116,6]-[116,20]: Invalid equality operand',
    'FATAL [116,24]-[116,38]: Invalid equality operand',
    'FATAL [117,6]-[117,17]: Invalid equality operand',
    'FATAL [117,21]-[117,32]: Invalid equality operand',
    'FATAL [124,3]-[124,7]: Arithmetic operator applied to invalid operand',
    'FATAL [125,3]-[125,7]: Arithmetic operator applied to invalid operand',
    'FATAL [126,3]-[126,13]: Invalid assignment operation',
    'FATAL [127,9]-[127,13]: Arithmetic operator applied to invalid operand',
    'FATAL [128,9]-[128,13]: Arithmetic operator applied to invalid operand',
    'FATAL [129,9]-[129,13]: Arithmetic operator applied to invalid operand',
    'FATAL [130,9]-[130,13]: Arithmetic operator applied to invalid operand',
    'FATAL [131,10]-[131,14]: Arithmetic operator applied to invalid operand',
    'FATAL [132,10]-[132,14]: Arithmetic operator applied to invalid operand',
    'FATAL [133,10]-[133,14]: Arithmetic operator applied to invalid operand',
    'FATAL [134,10]-[134,14]: Arithmetic operator applied to invalid operand',
    'FATAL [139,6]-[139,10]: Relational operator applied to non-numeric operand',
    'FATAL [140,6]-[140,10]: Relational operator applied to non-numeric operand',
    'FATAL [141,6]-[141,10]: Relational operator applied to non-numeric operand',
    'FATAL [142,6]-[142,10]: Relational operator applied to non-numeric operand',
    'FATAL [143,6]-[143,10]: Relational operator applied to non-numeric operand',
    'FATAL [143,13]-[143,17]: Relational operator applied to non-numeric operand',
    'FATAL [144,6]-[144,10]: Relational operator applied to non-numeric operand',
    'FATAL [144,13]-[144,17]: Relational operator applied to non-numeric operand',
    'FATAL [145,6]-[145,10]: Relational operator applied to non-numeric operand',
    'FATAL [145,14]-[145,18]: Relational operator applied to non-numeric operand',
    'FATAL [146,6]-[146,10]: Relational operator applied to non-numeric operand',
    'FATAL [146,14]-[146,18]: Relational operator applied to non-numeric operand',
    'FATAL [148,6]-[148,17]: Relational operator applied to non-numeric operand',
    'FATAL [148,21]-[148,25]: Relational operator applied to non-numeric operand',
    'FATAL [149,6]-[149,17]: Relational operator applied to non-numeric operand',
    'FATAL [149,21]-[149,35]: Relational operator applied to non-numeric operand',
    'FATAL [152,6]-[152,17]: Logical operator applied to non-bool operand',
    'FATAL [153,6]-[153,17]: Logical operator applied to non-bool operand',
    'FATAL [153,22]-[153,36]: Logical operator applied to non-bool operand',
    'FATAL [154,6]-[154,19]: Logical operator applied to non-bool operand',
    'FATAL [154,23]-[154,26]: Logical operator applied to non-bool operand',
    'FATAL [156,3]-[156,14]: Invalid assignment operand',
    'FATAL [157,3]-[157,14]: Invalid assignment operand',
    'FATAL [157,17]-[157,28]: Invalid assignment operand',
    'FATAL [158,3]-[158,14]: Invalid assignment operand',
    'FATAL [159,3]-[159,15]: Invalid assignment operand',
    'FATAL [160,3]-[160,15]: Invalid assignment operand',
    'FATAL [160,18]-[160,30]: Invalid assignment operand',
    'FATAL [161,3]-[161,15]: Invalid assignment operand',
    'FATAL [161,18]-[161,32]: Invalid assignment operand',
    'FATAL [162,6]-[162,16]: Invalid assignment operation',
    'FATAL [163,6]-[163,15]: Non-bool expression used as an if condition',
    'FATAL [167,9]-[167,21]: Attempt to assign user input to function',
    'FATAL [168,9]-[168,20]: Attempt to assign user input to function',
    'FATAL [170,10]-[170,21]: Attempt to output a function',
    'FATAL [171,10]-[171,22]: Attempt to output a function',
    'FATAL [172,10]-[172,24]: Attempt to output void',
    'FATAL [174,3]-[174,6]: Attempt to call a non-function',
    'FATAL [175,3]-[175,7]: Attempt to call a non-function',
    'FATAL [180,3]-[180,18]: Invalid assignment operand',
    'FATAL [180,21]-[180,32]: Invalid assignment operand',
    'FATAL [181,3]-[181,18]: Invalid assignment operand',
    'FATAL [181,21]-[181,33]: Invalid assignment operand',
    'FATAL [182,3]-[182,18]: Invalid assignment operand',
    'FATAL [183,3]-[183,18]: Invalid assignment operand',
    'FATAL [183,21]-[183,35]: Invalid assignment operand',
    'FATAL [186,3]-[186,11]: Function call with wrong number of args',
    'FATAL [187,3]-[187,22]: Function call with wrong number of args',
    'FATAL [188,10]-[188,21]: Type of actual does not match type of formal',
    'FATAL [188,23]-[188,35]: Type of actual does not match type of formal',
    'FATAL [190,10]-[190,13]: Type of actual does not match type of formal',
    'FATAL [190,15]-[190,19]: Type of actual does not match type of formal',
    'FATAL [192,9]-[192,23]: Arithmetic operator applied to invalid operand',
    'FATAL [195,3]-[195,9]: Missing return value',
    'FATAL [197,10]-[197,14]: Bad return value',
    'FATAL [199,6]-[199,9]: Non-bool expression used as an if condition',
    'FATAL [200,6]-[200,17]: Non-bool expression used as an if condition',
    'FATAL [201,6]-[201,20]: Non-bool expression used as an if condition',
    'FATAL [203,14]-[203,27]: Non-bool expression used as a loop condition',
    'FATAL [204,14]-[204,28]: Non-bool expression used as a loop condition',
    'FATAL [205,14]-[205,26]: Non-bool expression used as a loop condition',
    'FATAL [207,9]-[207,22]: Non-bool expression used as a loop condition',
    'FATAL [208,9]-[208,23]: Non-bool expression used as a loop condition',
    'FATAL [209,9]-[209,21]: Non-bool expression used as a loop condition',
    'FATAL [210,9]-[210,14]: Non-bool expression used as a loop condition',
    'FATAL [211,9]-[211,10]: Non-bool expression used as a loop condition',
  ]));
