import { nameParse, run, typeCheckAst } from '../../processInput.js';
import { toQuads } from '../index.js';

test('toMips', async () => {
  const ast = await run({
    rawText,
  });
  expect(ast).toBeDefined();
  expect(typeof nameParse(ast!, false)).toBe('string');
  expect(typeCheckAst(ast!, rawText)).toHaveLength(0);
  const quads = toQuads(ast!);
  quads.forEach((quad) => quad.toString());
  expect(quads.flatMap((quad) => quad.toMips()).join('\n')).toMatchSnapshot();
});

const rawText = `// Call this function in code and then set a breakpoint in it in MARS
// This is easier than trying to find the correct line in the output code
int break() {}

void left(int a) {
  output "left_";
  output a;
  output "\\n";
}

void right(int a) {
  output "right_";
  output a;
  output "\\n";
}

fn(int)->void twice(fn (int)->void f, int a) {
  f(a);
  f(a);
  return f;
}

fn (int) -> void globalPointer;
int testFunctionPointers() {
  fn (int)->void localPointer;
  int a;
  a = mayhem;
  int b;
  b = mayhem;
  if(a > b) {
    globalPointer = left;
    localPointer = right;
  }
  else {
    globalPointer = right;
    localPointer = left;
  }

  break();
  output "Calling a function using pointer:\\n";
  localPointer(b);

  fn (int) -> void result;
  output "Function as an actual:\\n";
  result = twice(globalPointer, a);
  output "Calling a function returned from another function:\\n";
  result(a);
}

int failCount;
int totalCount;

void assertBool(bool result) {
  totalCount++;
  output "Test #";
  output totalCount;
  output ": ";
  if(result) {
    output "Pass\\n";
  }
  else {
    output "Fail\\n";
    failCount++;
  }
}

bool not(bool a) {
  return !a;
}

void assert(int result, int expected) {
  totalCount++;
  output "Test #";
  output totalCount;
  output ": ";
  if(result == expected) {
    output "Pass\\n";
  }
  else {
    output "FAIL\\n";
    output "Expected: ";
    output expected;
    output "\\nReceived:";
    output result;
    output "\\n\\n";
    failCount++;
  }
}

void printSummary() {
  output "Passed ";
  output totalCount-failCount;
  output " of ";
  output totalCount;
  output " tests";
}

void testLoops() {
  for(int i; i< 10; i++) {
    output i;
    output "\\n";
  }

  int b;
  b = 10;
  while(b > 0) {
    output b;
    output "\\n";
    b--;
  }
}

void testOperators() {
  assertBool(true and true);
  assertBool(true or true);
  assertBool(not(true and false));
  assertBool(true or false);
  assertBool(not(false and true));
  assertBool(false or true);
  assertBool(not(false and false));
  assertBool(not(false or false));

  assertBool(3>2);
  assertBool(not(2>2));
  assertBool(not(2>3));

  assertBool(not(3<2));
  assertBool(not(2<2));
  assertBool(2<3);

  assertBool(3>=2);
  assertBool(2>=2);
  assertBool(not(2>=3));

  assertBool(not(3<=2));
  assertBool(2<=2);
  assertBool(2<=3);

  assertBool(not(3==2));
  assertBool(2==2);

  assertBool(3!=2);
  assertBool(not(2!=2));

  assert(2 + 3, 5);
  assert(2 - 3, -1);
  assert(2 * 3, 6);
  // Remainder is ignored
  assert(9 / 4, 2);
}

int main() {
  testLoops();
  testOperators();
  testFunctionPointers();

  printSummary();
}`;
