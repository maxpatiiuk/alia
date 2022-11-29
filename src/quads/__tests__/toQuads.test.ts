import { nameParse, run, typeCheckAst } from '../../frontEnd.js';
import { toQuads } from '../index.js';

test('toQuads', async () => {
  const ast = await run({
    rawText,
  });
  expect(ast).toBeDefined();
  expect(typeof nameParse(ast!, false)).toBe('string');
  expect(typeCheckAst(ast!, rawText)).toHaveLength(0);
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
[END GLOBALS]
[BEGIN b LOCALS]
d (formal arg of 8 bytes)
c (local var of 8 bytes)
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
[END b LOCALS]
fun_b:  nop
        enter b
        getarg 1 [d]
        [tmp6] := 3 ADD64 [c]
        [c] := [tmp1]
        [tmp8] := 3 ADD64 [c]
        REPORT [tmp8]
        REPORT [a]
        setret 1
        goto lbl_0
        setret 2
        goto lbl_0
        [tmp12] := 3 ADD64 [c]
        setret [tmp12]
        goto lbl_0
lbl_0:  nop
        leave b
[BEGIN r LOCALS]
c (local var of 8 bytes)
tmp0 (tmp var of 8 bytes)
tmp1 (tmp var of 8 bytes)
tmp2 (tmp var of 8 bytes)
[END r LOCALS]
fun_r:  nop
        enter r
        goto lbl_1
lbl_1:  nop
        leave r
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
tmp26 (tmp var of 8 bytes)
tmp27 (tmp var of 8 bytes)
tmp28 (tmp var of 8 bytes)
tmp29 (tmp var of 8 bytes)
tmp30 (tmp var of 8 bytes)
tmp31 (tmp var of 8 bytes)
tmp32 (tmp var of 8 bytes)
tmp33 (tmp var of 8 bytes)
tmp34 (tmp var of 8 bytes)
tmp35 (tmp var of 8 bytes)
tmp36 (tmp var of 8 bytes)
tmp37 (tmp var of 8 bytes)
tmp38 (tmp var of 8 bytes)
tmp39 (tmp var of 8 bytes)
tmp40 (tmp var of 8 bytes)
tmp41 (tmp var of 8 bytes)
tmp42 (tmp var of 8 bytes)
tmp43 (tmp var of 8 bytes)
tmp44 (tmp var of 8 bytes)
tmp45 (tmp var of 8 bytes)
tmp46 (tmp var of 8 bytes)
tmp47 (tmp var of 8 bytes)
tmp48 (tmp var of 8 bytes)
tmp49 (tmp var of 8 bytes)
tmp50 (tmp var of 8 bytes)
tmp51 (tmp var of 8 bytes)
tmp52 (tmp var of 8 bytes)
tmp53 (tmp var of 8 bytes)
tmp54 (tmp var of 8 bytes)
tmp55 (tmp var of 8 bytes)
tmp56 (tmp var of 8 bytes)
tmp57 (tmp var of 8 bytes)
tmp58 (tmp var of 8 bytes)
tmp59 (tmp var of 8 bytes)
tmp60 (tmp var of 8 bytes)
[END main_a_A_A_a_A_a_A_A_A_A_A_A_A_A LOCALS]
fun_main_a_A_A_a_A_a_A_A_A_A_A_A_A_A:  nop
                                       enter main_a_A_A_a_A_a_A_A_A_A_A_A_A_A
                                       getarg 1 [a]
                                       [b] := [tmp1]
                                       [tmp8] := 3 ADD64 [c]
                                       [c] := [tmp2]
                                       [c] := [tmp8]
                                       [c] := [tmp7]
                                       IFZ [tmp12] GOTO lbl_3
                                       REPORT [c]
                                       goto lbl_4
lbl_3:                                 nop
                                       RECEIVE [c]
lbl_4:                                 nop
                                       IFZ [tmp16] GOTO lbl_5
                                       [tmp17] := [c] LTE64 [c]
                                       REPORT [tmp17]
lbl_5:                                 nop
                                       [tmp19] := 3 SUB64 [c]
                                       [c] := [tmp3]
                                       [tmp21] := 3 ADD64 [c]
                                       [c] := [tmp8]
                                       [tmp23] := 3 DIV64 [c]
                                       [c] := [tmp3]
                                       [tmp25] := 3 MULT64 [c]
                                       [c] := [tmp8]
                                       [tmp27] := 3 ADD64 [c]
                                       [c] := [tmp3]
                                       [tmp29] := 3 ADD64 [c]
                                       [c] := [tmp8]
                                       [tmp31] := 3 ADD64 [c]
                                       [c] := [tmp3]
                                       [tmp33] := 3 ADD64 [c]
                                       [c] := [tmp8]
                                       [tmp35] := 3 ADD64 [c]
                                       [c] := [tmp3]
                                       [tmp37] := 3 ADD64 [c]
                                       [c] := [tmp8]
                                       [tmp39] := 3 ADD64 [c]
                                       [c] := [tmp3]
                                       [tmp41] := 3 ADD64 [c]
                                       [c] := [tmp8]
                                       [tmp43] := 3 ADD64 [c]
                                       [c] := [tmp3]
                                       [tmp45] := 3 ADD64 [c]
                                       [c] := [tmp8]
                                       [tmp47] := 3 ADD64 [c]
                                       [c] := [tmp3]
                                       [tmp49] := 3 ADD64 [c]
                                       [c] := [tmp8]
                                       [tmp51] := 3 ADD64 [c]
                                       [c] := [tmp3]
                                       [tmp53] := 3 ADD64 [c]
                                       [c] := [tmp8]
                                       [tmp55] := 3 ADD64 [c]
                                       [c] := [tmp3]
                                       [c] := [c] SUB64 1
                                       [c] := [c] ADD64 1
                                       [tmp58] := NEG64 [c]
                                       [c] := [tmp2]
                                       [tmp60] := [c] ADD64 3
                                       [tmp61] := NEG64 [tmp60]
                                       [c] := [tmp6]
lbl_2:                                 nop
                                       leave main_a_A_A_a_A_a_A_A_A_A_A_A_A_A
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
[END d LOCALS]
fun_d:   nop
         enter d
         REPORT str_0
         REPORT str_1
         REPORT str_1
         REPORT str_1
         REPORT str_1
         REPORT str_1
         [tmp6] := 1 AND64 [v]
         [tmp7] := NOT64 [tmp6]
         [tmp9] := [tmp7] OR64 0
         [v] := [tmp1]
         [tmp10] := [d] GT64 [d]
         [tmp11] := [d] LT64 [d]
         [tmp12] := [tmp10] EQ64 [tmp11]
         [v] := [tmp3]
         [tmp13] := [d] NEQ64 [d]
         [v] := [tmp3]
         setarg 1 4
         call b
lbl_7:   nop
         IFZ 1 GOTO lbl_8
         setarg 1 4
         call b
         getret [tmp19]
         [d] := [tmp0]
         goto lbl_7
lbl_8:   nop
lbl_9:   nop
         IFZ [tmp22] GOTO lbl_10
         REPORT [i]
         [tmp24] := [tmp24] ADD64 1
         [i] := [tmp8]
         goto lbl_9
lbl_10:  nop
         MAYHEM [tmp26]
         [d] := [tmp3]
lbl_6:   nop
         leave d`);
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
