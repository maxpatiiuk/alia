import { run } from '../../../processInput.js';
import { toQuads } from '../index.js';

test('toQuads', async () => {
  const ast = await run({
    rawText,
  });
  expect(ast).toBeDefined();
  const quads = toQuads(ast!);
  expect(quads.flatMap((quad) => quad.toString()).join('\n'))
    .toBe(`[BEGIN GLOBALS]
a
b
r
main_a_A_A_a_A_a_A_A_A_A_A_A_A_A
d
str_0 "1"
str_1 "a"
str_2 "a"
str_3 "a"
str_4 "a"
str_5 "a"
[END GLOBALS]
[BEGIN b LOCALS]
d (formal arg of 8 bytes)
c (local var of 8 bytes)
tmp0 (tmp var of 8 bytes)
tmp1 (tmp var of 8 bytes)
tmp2 (tmp var of 8 bytes)
[END b LOCALS]
fun_b:      enter b
            getarg 1 [d]
            [tmp0] := 3 ADD64 [c]
            [c] := [tmp0]
            [tmp1] := 3 ADD64 [c]
            REPORT [tmp1]
            REPORT [a]
            setret 1
            goto lbl_0
            setret 2
            goto lbl_0
            [tmp2] := 3 ADD64 [c]
            setret [tmp2]
            goto lbl_0
lbl_0:      leave b
[BEGIN r LOCALS]
c (local var of 8 bytes)
[END r LOCALS]
fun_r:      enter r
            goto lbl_1
lbl_1:      leave r
[BEGIN main_a_A_A_a_A_a_A_A_A_A_A_A_A_A LOCALS]
a (formal arg of 8 bytes)
c (local var of 8 bytes)
tmp0 (local var of 8 bytes)
b (local var of 8 bytes)
g (local var of 8 bytes)
c (local var of 8 bytes)
d (local var of 8 bytes)
tmp0 (tmp var of 8 bytes)
tmp1 (tmp var of 8 bytes)
tmp2 (tmp var of 8 bytes)
tmp3 (tmp var of 8 bytes)
tmp4 (tmp var of 8 bytes)
tmp5 (tmp var of 8 bytes)
tmp6 (tmp var of 8 bytes)
tmp7 (tmp var of 8 bytes)
tmp8 (tmp var of 8 bytes)
tmp9 (tmp var of 8 bytes)
tmp10 (tmp var of 8 bytes)
tmp11 (tmp var of 8 bytes)
tmp12 (tmp var of 8 bytes)
tmp13 (tmp var of 8 bytes)
tmp14 (tmp var of 8 bytes)
tmp15 (tmp var of 8 bytes)
tmp16 (tmp var of 8 bytes)
tmp17 (tmp var of 8 bytes)
tmp18 (tmp var of 8 bytes)
tmp19 (tmp var of 8 bytes)
tmp20 (tmp var of 8 bytes)
tmp21 (tmp var of 8 bytes)
tmp22 (tmp var of 8 bytes)
tmp23 (tmp var of 8 bytes)
tmp24 (tmp var of 8 bytes)
tmp25 (tmp var of 8 bytes)
[END main_a_A_A_a_A_a_A_A_A_A_A_A_A_A LOCALS]
fun_main_a_A_A_a_A_a_A_A_A_A_A_A_A_A: enter main_a_A_A_a_A_a_A_A_A_A_A_A_A_A
            getarg 1 [a]
            [b] := [a]
            [tmp0] := 3 ADD64 [c]
            [c] := [tmp0]
            [c] := 3
            [c] := [c]
            [tmp1] := [c] EQ64 3
            IFZ [tmp1] GOTO lbl_3
            REPORT [c]
            goto lbl_4
lbl_3:      nop
            RECEIVE [c]
lbl_4:      nop
            [tmp2] := [c] GTE64 3
            IFZ [tmp2] GOTO lbl_5
            [tmp3] := [c] LTE64 [c]
            REPORT [tmp3]
lbl_5:      nop
            [tmp4] := 3 SUB64 [c]
            [c] := [tmp4]
            [tmp5] := 3 ADD64 [c]
            [c] := [tmp5]
            [tmp6] := 3 DIV64 [c]
            [c] := [tmp6]
            [tmp7] := 3 MULT64 [c]
            [c] := [tmp7]
            [tmp8] := 3 ADD64 [c]
            [c] := [tmp8]
            [tmp9] := 3 ADD64 [c]
            [c] := [tmp9]
            [tmp10] := 3 ADD64 [c]
            [c] := [tmp10]
            [tmp11] := 3 ADD64 [c]
            [c] := [tmp11]
            [tmp12] := 3 ADD64 [c]
            [c] := [tmp12]
            [tmp13] := 3 ADD64 [c]
            [c] := [tmp13]
            [tmp14] := 3 ADD64 [c]
            [c] := [tmp14]
            [tmp15] := 3 ADD64 [c]
            [c] := [tmp15]
            [tmp16] := 3 ADD64 [c]
            [c] := [tmp16]
            [tmp17] := 3 ADD64 [c]
            [c] := [tmp17]
            [tmp18] := 3 ADD64 [c]
            [c] := [tmp18]
            [tmp19] := 3 ADD64 [c]
            [c] := [tmp19]
            [tmp20] := 3 ADD64 [c]
            [c] := [tmp20]
            [tmp21] := 3 ADD64 [c]
            [c] := [tmp21]
            [tmp22] := 3 ADD64 [c]
            [c] := [tmp22]
            [c] := [c] SUB64 1
            [c] := [c] ADD64 1
            [tmp23] := NEG64 [c]
            [c] := [tmp23]
            [tmp24] := [c] ADD64 3
            [tmp25] := NEG64 [tmp24]
            [c] := [tmp25]
lbl_2:      leave main_a_A_A_a_A_a_A_A_A_A_A_A_A_A
[BEGIN d LOCALS]
d (local var of 8 bytes)
v (local var of 8 bytes)
i (local var of 8 bytes)
tmp0 (tmp var of 8 bytes)
tmp1 (tmp var of 8 bytes)
tmp2 (tmp var of 8 bytes)
tmp3 (tmp var of 8 bytes)
tmp4 (tmp var of 8 bytes)
tmp5 (tmp var of 8 bytes)
tmp6 (tmp var of 8 bytes)
tmp7 (tmp var of 8 bytes)
tmp8 (tmp var of 8 bytes)
tmp9 (tmp var of 8 bytes)
tmp10 (tmp var of 8 bytes)
[END d LOCALS]
fun_d:      enter d
            REPORT str_0
            REPORT str_1
            REPORT str_2
            REPORT str_3
            REPORT str_4
            REPORT str_5
            [tmp0] := 1 AND64 [v]
            [tmp1] := NOT64 [tmp0]
            [tmp2] := [tmp1] OR64 0
            [v] := [tmp2]
            [tmp3] := [d] GT64 [d]
            [tmp4] := [d] LT64 [d]
            [tmp5] := [tmp3] EQ64 [tmp4]
            [v] := [tmp5]
            [tmp6] := [d] NEQ64 [d]
            [v] := [tmp6]
            setarg 1 4
            call b
lbl_7:      nop
            IFZ 1 GOTO lbl_8
            setarg 1 4
            call b
            getret [tmp7]
            [d] := [tmp7]
            goto lbl_7
lbl_8:      nop
lbl_9:      nop
            [tmp8] := [i] LT64 3
            IFZ [tmp8] GOTO lbl_10
            REPORT [i]
            [tmp9] := [i] ADD64 1
            [i] := [tmp9]
            goto lbl_9
lbl_10:     nop
            MAYHEM [tmp10]
            [d] := [tmp10]
lbl_6:      leave d`);
});

const rawText = `int a;

int b(int d) {
  int c;
  c = 3 + c;
  output 3 + c;
  output a;
  return 1;
  return 2;
  return 3 + c;
}

void r() {
  int c;
  return;
}

// Testing long labels
int main_a_A_A_a_A_a_A_A_A_A_A_A_A_A(fn ()->int a) {
  int c;
  int tmp0;
  fn ()->int b;
  b = a;
  c = 3 + c;
  c = (c = 3);
  fn (int) -> int g;
  if (c == 3) {
    bool c;
    int d;
    output c;
  } else {
    input c;
  }
  if(c >= 3) {
    output c <= c;
  }
  // Testing if there is a limit on number of temp variables
  c = 3 - c;
  c = 3 + c;
  c = 3 / c;
  c = 3 * c;
  c = 3 + c;
  c = 3 + c;
  c = 3 + c;
  c = 3 + c;
  c = 3 + c;
  c = 3 + c;
  c = 3 + c;
  c = 3 + c;
  c = 3 + c;
  c = 3 + c;
  c = 3 + c;
  c = 3 + c;
  c = 3 + c;
  c = 3 + c;
  c = 3 + c;
  c--;
  c++;
  c = -c;
  c = -(c + 3);
}

int d() {
  output "1";
  output "a";
  output "a";
  output "a";
  output "a";
  output "a";
  int d;
  bool v;
  v = !(true and v) or false;
  v = (d > d) == (d < d);
  v = d != d;
  b(4);
  while(true) {
    d = b(4);
  }
  for(int i; i < 3; i = i + 1) {
    output i;
  }
  d = mayhem;
}`;
