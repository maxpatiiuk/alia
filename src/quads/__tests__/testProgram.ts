export const testProgram = `// Call this function in code and then set a breakpoint in it in MARS
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
  output " tests\\n\\n\\n";
}

int testNumber;
void printTestHeader() {
  testNumber++;
  output "Section #";
  output testNumber;
  output ":\\n";
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

int var;

int testShadowingHelper() {
  var = 4;
  int var;
  var = 2;
  return var;
}

void testShadowing() {
  int returnValue;
  returnValue = testShadowingHelper();
  assert(var, 4);
  assert(returnValue, 2);
}

int testLongExpression(bool isFirstCall) {
  int a;
  a = 1;
  int b;
  b = 2;
  int c;
  c = 3;
  int d;
  d = 4;
  int e;
  e = 5;
  int f;
  f = 6;
  int g;
  g = 7;

  if(isFirstCall) {
    a = (a + b) * (d / c) - (testLongExpression(false) / e);
    assert(a, -2);
  }
  else {
    a = a + b + c + d + e + f + g;
    assert(a, 28);
    return a;
  }
}

void tonOfArguments(int a, int b, int c, int d, int e, int f, int g) {
  output a;
  output "\\n";
  output b;
  output "\\n";
  output c;
  output "\\n";
  output d;
  output "\\n";
  output e;
  output "\\n";
  output f;
  output "\\n";
  output g;
  output "\\n";
}

void testTonOfArguments() {
  tonOfArguments(11,22,33,44,55,66,77);
}


int main() {
  printTestHeader();
  testOperators();

  printTestHeader();
  testLoops();

  printTestHeader();
  testTonOfArguments();

  printTestHeader();
  testShadowing();

  printTestHeader();
  testLongExpression(true);

  printTestHeader();
  testFunctionPointers();

  printSummary();
}`;
