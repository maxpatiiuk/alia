import type { PrintContext } from '../ast/definitions.js';
import { namedParse, run } from '../process.js';
import type { RA } from '../utils/types.js';

async function nameAnalysis(
  input: string
): Promise<RA<string> | string | undefined> {
  const ast = await run(input, undefined, undefined, false, 'SLR', 'ast');
  if (ast === undefined) return undefined;
  const printContext: PrintContext = {
    indent: 0,
    mode: 'nameAnalysis',
    debug: false,
    needWrapping: false,
  };

  return namedParse(input, ast, printContext);
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
    baz(void)();
    bar(int)(val(int), 10 - 4);
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
