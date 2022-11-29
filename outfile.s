.globl main
.data
global_globalPointer:         .quad 0
global_failCount:             .quad 0
global_totalCount:            .quad 0
global_testNumber:            .quad 0
global_var:                   .quad 0
str_0:                        .asciz "left_"
str_1:                        .asciz "\n"
str_2:                        .asciz "right_"
str_3:                        .asciz "Calling a function using pointer:\n"
str_4:                        .asciz "Function as an actual:\n"
str_5:                        .asciz "Calling a function returned from another function:\n"
str_6:                        .asciz "Test #"
str_7:                        .asciz ": "
str_8:                        .asciz "Pass\n"
str_9:                        .asciz "Fail\n"
str_10:                       .asciz "FAIL\n"
str_11:                       .asciz "Expected: "
str_12:                       .asciz "\nReceived:"
str_13:                       .asciz "\n\n"
str_14:                       .asciz "Passed "
str_15:                       .asciz " of "
str_16:                       .asciz " tests"
str_17:                       .asciz "Section #"
str_18:                       .asciz ":\n"
.text
global_break:                 push %rbp
                              movq %rsp, %rbp  # BEGIN Function body
lbl_0:                        leave  # END Function body
                              retq


global_left:                  push %rbp
                              movq %rsp, %rbp  # BEGIN Function body
                              movq 16(%rbp), %rbx  # Getting argument "a"
                              movq %rbx, -24(%rbp)
                              movq $str_0, %rdi  # BEGIN Output  # String Literal: "left_"
                              subq $24, %rsp  # BEGIN Calling printString
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq printString
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $24, %rsp  # END Output  # END Calling printString
                              movq -24(%rbp), %rdi  # BEGIN Output
                              subq $24, %rsp  # BEGIN Calling printInt
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq printInt
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $24, %rsp  # END Output  # END Calling printInt
                              movq $str_1, %rdi  # BEGIN Output  # String Literal: "\n"
                              subq $24, %rsp  # BEGIN Calling printString
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq printString
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $24, %rsp  # END Output  # END Calling printString
lbl_1:                        leave  # END Function body
                              retq


global_right:                 push %rbp
                              movq %rsp, %rbp  # BEGIN Function body
                              movq 16(%rbp), %rbx  # Getting argument "a"
                              movq %rbx, -24(%rbp)
                              movq $str_2, %rdi  # BEGIN Output  # String Literal: "right_"
                              subq $24, %rsp  # BEGIN Calling printString
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq printString
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $24, %rsp  # END Output  # END Calling printString
                              movq -24(%rbp), %rdi  # BEGIN Output
                              subq $24, %rsp  # BEGIN Calling printInt
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq printInt
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $24, %rsp  # END Output  # END Calling printInt
                              movq $str_1, %rdi  # BEGIN Output  # String Literal: "\n"
                              subq $24, %rsp  # BEGIN Calling printString
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq printString
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $24, %rsp  # END Output  # END Calling printString
lbl_2:                        leave  # END Function body
                              retq


global_twice:                 push %rbp
                              movq %rsp, %rbp  # BEGIN Function body
                              movq 24(%rbp), %rbx  # Getting argument "f"
                              movq %rbx, -24(%rbp)
                              movq 16(%rbp), %rbx  # Getting argument "a"
                              movq %rbx, -32(%rbp)
                              subq $48, %rsp  # BEGIN Calling f
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              movq -32(%rbp), %r12  # Setting argument 1
                              push %r12
                              movq -24(%rbp), %rax  # Calling function by pointer
                              callq *%rax
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $56, %rsp  # END Calling f
                              subq $48, %rsp  # BEGIN Calling f
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              movq -32(%rbp), %r13  # Setting argument 1
                              push %r13
                              movq -24(%rbp), %rax  # Calling function by pointer
                              callq *%rax
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $56, %rsp  # END Calling f
                              movq -24(%rbp), %rax  # BEGIN Return
lbl_3:                        leave  # END Function body
                              retq


global_testFunctionPointers:  push %rbp
                              movq %rsp, %rbp  # BEGIN Function body
                              movq $0, -24(%rbp)  # Initializing localPointer
                              movq $0, -32(%rbp)  # Initializing a
                              subq $40, %rsp  # BEGIN Calling mayhem
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq mayhem
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $40, %rsp  # END Calling mayhem
                              movq %rax, -40(%rbp)
                              movq -40(%rbp), %r12
                              movq %r12, -32(%rbp)  # BEGIN Assigning a  # END Assigning a
                              movq $0, -48(%rbp)  # Initializing b
                              subq $56, %rsp  # BEGIN Calling mayhem
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq mayhem
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $56, %rsp  # END Calling mayhem
                              movq %rax, -56(%rbp)
                              movq -56(%rbp), %r13
                              movq %r13, -48(%rbp)  # BEGIN Assigning b  # END Assigning b
                              movq -32(%rbp), %r15  # BEGIN if  # BEGIN If Condition  # Operation: GT64
                              movq -48(%rbp), %rbx
                              cmpq %rbx, %r15
                              setg %r14b
                              andq $1, %r14
                              movq %r14, -64(%rbp)
                              movq -64(%rbp), %rbx
                              cmpq $0, %rbx
                              je lbl_5  # END If Condition
                              movq $global_left, global_globalPointer  # BEGIN True Branch  # BEGIN Assigning globalPointer  # END Assigning globalPointer
                              movq $global_right, -24(%rbp)  # BEGIN Assigning localPointer  # END True Branch  # END Assigning localPointer
                              jmp lbl_6
lbl_5:                        movq $global_right, global_globalPointer  # BEGIN False Branch  # BEGIN Assigning globalPointer  # END Assigning globalPointer
                              movq $global_left, -24(%rbp)  # BEGIN Assigning localPointer  # END if  # END False Branch  # END Assigning localPointer
lbl_6:                        subq $72, %rsp  # BEGIN Calling break
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq global_break
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $72, %rsp  # END Calling break
                              movq $str_3, %rdi  # BEGIN Output  # String Literal: "Calling a function using pointer:\n"
                              subq $72, %rsp  # BEGIN Calling printString
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq printString
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $72, %rsp  # END Output  # END Calling printString
                              subq $80, %rsp  # BEGIN Calling localPointer
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              movq -48(%rbp), %r12  # Setting argument 1
                              push %r12
                              movq -24(%rbp), %rax  # Calling function by pointer
                              callq *%rax
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $88, %rsp  # END Calling localPointer
                              movq $0, -80(%rbp)  # Initializing result
                              movq $str_4, %rdi  # BEGIN Output  # String Literal: "Function as an actual:\n"
                              subq $88, %rsp  # BEGIN Calling printString
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq printString
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $88, %rsp  # END Output  # END Calling printString
                              subq $104, %rsp  # BEGIN Calling twice
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              movq global_globalPointer, %r14  # Setting argument 1
                              push %r14
                              movq -32(%rbp), %r14  # Setting argument 2
                              push %r14
                              callq global_twice
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $120, %rsp  # END Calling twice
                              movq %rax, -104(%rbp)
                              movq -104(%rbp), %r13
                              movq %r13, -80(%rbp)  # BEGIN Assigning result  # END Assigning result
                              movq $str_5, %rdi  # BEGIN Output  # String Literal: "Calling a function returned from another function:\n"
                              subq $104, %rsp  # BEGIN Calling printString
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq printString
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $104, %rsp  # END Output  # END Calling printString
                              subq $112, %rsp  # BEGIN Calling result
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              movq -32(%rbp), %r15  # Setting argument 1
                              push %r15
                              movq -80(%rbp), %rax  # Calling function by pointer
                              callq *%rax
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $120, %rsp  # END Calling result
lbl_4:                        leave  # END Function body
                              retq


global_assertBool:            push %rbp
                              movq %rsp, %rbp  # BEGIN Function body
                              movq 16(%rbp), %rbx  # Getting argument "result"
                              movq %rbx, -24(%rbp)
                              movq global_totalCount, %r12  # BEGIN PostInc
                              incq %r12
                              movq %r12, global_totalCount  # END PostInc
                              movq $str_6, %rdi  # BEGIN Output  # String Literal: "Test #"
                              subq $40, %rsp  # BEGIN Calling printString
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq printString
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $40, %rsp  # END Output  # END Calling printString
                              movq global_totalCount, %rdi  # BEGIN Output
                              subq $40, %rsp  # BEGIN Calling printInt
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq printInt
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $40, %rsp  # END Output  # END Calling printInt
                              movq $str_7, %rdi  # BEGIN Output  # String Literal: ": "
                              subq $40, %rsp  # BEGIN Calling printString
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq printString
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $40, %rsp  # END Output  # END Calling printString
                              movq -24(%rbp), %rbx  # BEGIN if  # BEGIN If Condition
                              cmpq $0, %rbx
                              je lbl_8  # END If Condition
                              movq $str_8, %rdi  # BEGIN True Branch  # BEGIN Output  # String Literal: "Pass\n"
                              subq $40, %rsp  # BEGIN Calling printString
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq printString
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $40, %rsp  # END True Branch  # END Output  # END Calling printString
                              jmp lbl_9
lbl_8:                        movq $str_9, %rdi  # BEGIN False Branch  # BEGIN Output  # String Literal: "Fail\n"
                              subq $40, %rsp  # BEGIN Calling printString
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq printString
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $40, %rsp  # END Output  # END Calling printString
                              movq global_failCount, %r14  # BEGIN PostInc
                              incq %r14
                              movq %r14, global_failCount  # END if  # END False Branch  # END PostInc
lbl_9:                        leave  # END Function body
                              retq


global_not:                   push %rbp
                              movq %rsp, %rbp  # BEGIN Function body
                              movq 16(%rbp), %rbx  # Getting argument "a"
                              movq %rbx, -24(%rbp)
                              movq -24(%rbp), %r12  # BEGIN Return  # Operation: NOT64
                              not %r12
                              movq %r12, -32(%rbp)
                              movq -32(%rbp), %rax
lbl_10:                       leave  # END Function body
                              retq


global_assert:                push %rbp
                              movq %rsp, %rbp  # BEGIN Function body
                              movq 24(%rbp), %rbx  # Getting argument "result"
                              movq %rbx, -24(%rbp)
                              movq 16(%rbp), %rbx  # Getting argument "expected"
                              movq %rbx, -32(%rbp)
                              movq global_totalCount, %r12  # BEGIN PostInc
                              incq %r12
                              movq %r12, global_totalCount  # END PostInc
                              movq $str_6, %rdi  # BEGIN Output  # String Literal: "Test #"
                              subq $40, %rsp  # BEGIN Calling printString
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq printString
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $40, %rsp  # END Output  # END Calling printString
                              movq global_totalCount, %rdi  # BEGIN Output
                              subq $40, %rsp  # BEGIN Calling printInt
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq printInt
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $40, %rsp  # END Output  # END Calling printInt
                              movq $str_7, %rdi  # BEGIN Output  # String Literal: ": "
                              subq $40, %rsp  # BEGIN Calling printString
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq printString
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $40, %rsp  # END Output  # END Calling printString
                              movq -24(%rbp), %r15  # BEGIN if  # BEGIN If Condition  # Operation: EQ64
                              movq -32(%rbp), %rbx
                              cmpq %rbx, %r15
                              sete %r14b
                              andq $1, %r14
                              movq %r14, -48(%rbp)
                              movq -48(%rbp), %r14
                              cmpq $0, %r14
                              je lbl_12  # END If Condition
                              movq $str_8, %rdi  # BEGIN True Branch  # BEGIN Output  # String Literal: "Pass\n"
                              subq $56, %rsp  # BEGIN Calling printString
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq printString
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $56, %rsp  # END True Branch  # END Output  # END Calling printString
                              jmp lbl_13
lbl_12:                       movq $str_10, %rdi  # BEGIN False Branch  # BEGIN Output  # String Literal: "FAIL\n"
                              subq $56, %rsp  # BEGIN Calling printString
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq printString
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $56, %rsp  # END Output  # END Calling printString
                              movq $str_11, %rdi  # BEGIN Output  # String Literal: "Expected: "
                              subq $56, %rsp  # BEGIN Calling printString
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq printString
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $56, %rsp  # END Output  # END Calling printString
                              movq -32(%rbp), %rdi  # BEGIN Output
                              subq $56, %rsp  # BEGIN Calling printInt
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq printInt
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $56, %rsp  # END Output  # END Calling printInt
                              movq $str_12, %rdi  # BEGIN Output  # String Literal: "\nReceived:"
                              subq $56, %rsp  # BEGIN Calling printString
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq printString
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $56, %rsp  # END Output  # END Calling printString
                              movq -24(%rbp), %rdi  # BEGIN Output
                              subq $56, %rsp  # BEGIN Calling printInt
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq printInt
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $56, %rsp  # END Output  # END Calling printInt
                              movq $str_13, %rdi  # BEGIN Output  # String Literal: "\n\n"
                              subq $56, %rsp  # BEGIN Calling printString
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq printString
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $56, %rsp  # END Output  # END Calling printString
                              movq global_failCount, %r12  # BEGIN PostInc
                              incq %r12
                              movq %r12, global_failCount  # END if  # END False Branch  # END PostInc
lbl_13:                       leave  # END Function body
                              retq


global_printSummary:          push %rbp
                              movq %rsp, %rbp  # BEGIN Function body
                              movq $str_14, %rdi  # BEGIN Output  # String Literal: "Passed "
                              subq $24, %rsp  # BEGIN Calling printString
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq printString
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $24, %rsp  # END Output  # END Calling printString
                              movq global_totalCount, %r13  # BEGIN Output  # Operation: SUB64
                              movq global_failCount, %r14
                              movq %r13, %r12
                              subq %r14, %r12
                              movq %r12, -24(%rbp)
                              movq -24(%rbp), %rdi
                              subq $24, %rsp  # BEGIN Calling printInt
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq printInt
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $24, %rsp  # END Output  # END Calling printInt
                              movq $str_15, %rdi  # BEGIN Output  # String Literal: " of "
                              subq $24, %rsp  # BEGIN Calling printString
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq printString
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $24, %rsp  # END Output  # END Calling printString
                              movq global_totalCount, %rdi  # BEGIN Output
                              subq $24, %rsp  # BEGIN Calling printInt
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq printInt
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $24, %rsp  # END Output  # END Calling printInt
                              movq $str_16, %rdi  # BEGIN Output  # String Literal: " tests"
                              subq $24, %rsp  # BEGIN Calling printString
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq printString
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $24, %rsp  # END Output  # END Calling printString
lbl_14:                       leave  # END Function body
                              retq


global_printTestHeader:       push %rbp
                              movq %rsp, %rbp  # BEGIN Function body
                              movq global_testNumber, %r12  # BEGIN PostInc
                              incq %r12
                              movq %r12, global_testNumber  # END PostInc
                              movq $str_17, %rdi  # BEGIN Output  # String Literal: "Section #"
                              subq $24, %rsp  # BEGIN Calling printString
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq printString
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $24, %rsp  # END Output  # END Calling printString
                              movq global_testNumber, %rdi  # BEGIN Output
                              subq $24, %rsp  # BEGIN Calling printInt
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq printInt
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $24, %rsp  # END Output  # END Calling printInt
                              movq $str_18, %rdi  # BEGIN Output  # String Literal: ":\n"
                              subq $24, %rsp  # BEGIN Calling printString
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq printString
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $24, %rsp  # END Output  # END Calling printString
lbl_15:                       leave  # END Function body
                              retq


global_testLoops:             push %rbp
                              movq %rsp, %rbp  # BEGIN Function body
                              movq $0, -24(%rbp)  # BEGIN for loop  # Initializing i
lbl_17:                       movq $10, -32(%rbp)  # BEGIN if  # BEGIN If Condition  # Operation: LT64  # Int Literal: 10
                              movq -24(%rbp), %r14
                              movq -32(%rbp), %r15
                              cmpq %r15, %r14
                              setl %r13b
                              andq $1, %r13
                              movq %r13, -40(%rbp)
                              movq -40(%rbp), %r13
                              cmpq $0, %r13
                              je lbl_18  # END If Condition
                              movq -24(%rbp), %rdi  # BEGIN True Branch  # BEGIN Output
                              subq $40, %rsp  # BEGIN Calling printInt
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq printInt
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $40, %rsp  # END Output  # END Calling printInt
                              movq $str_1, %rdi  # BEGIN Output  # String Literal: "\n"
                              subq $40, %rsp  # BEGIN Calling printString
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq printString
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $40, %rsp  # END Output  # END Calling printString
                              movq -24(%rbp), %rbx  # BEGIN PostInc
                              incq %rbx
                              movq %rbx, -24(%rbp)  # END PostInc
                              jmp lbl_17  # END for loop  # END if  # END True Branch
lbl_18:                       movq $0, -56(%rbp)  # Initializing b
                              movq $10, -64(%rbp)  # Int Literal: 10
                              movq -64(%rbp), %r14
                              movq %r14, -56(%rbp)  # BEGIN Assigning b  # END Assigning b
lbl_19:                       movq $0, -72(%rbp)  # BEGIN for loop  # BEGIN if  # BEGIN If Condition  # Operation: GT64  # Int Literal: 0
                              movq -56(%rbp), %r13
                              movq -72(%rbp), %r14
                              cmpq %r14, %r13
                              setg %r12b
                              andq $1, %r12
                              movq %r12, -80(%rbp)
                              movq -80(%rbp), %r12
                              cmpq $0, %r12
                              je lbl_20  # END If Condition
                              movq -56(%rbp), %rdi  # BEGIN True Branch  # BEGIN Output
                              subq $88, %rsp  # BEGIN Calling printInt
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq printInt
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $88, %rsp  # END Output  # END Calling printInt
                              movq $str_1, %rdi  # BEGIN Output  # String Literal: "\n"
                              subq $88, %rsp  # BEGIN Calling printString
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq printString
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $88, %rsp  # END Output  # END Calling printString
                              movq -56(%rbp), %r15  # BEGIN PostDec
                              decq %r15
                              movq %r15, -56(%rbp)  # END PostDec
                              jmp lbl_19  # END for loop  # END if  # END True Branch
lbl_20:                       leave  # END Function body
                              retq


global_testOperators:         push %rbp
                              movq %rsp, %rbp  # BEGIN Function body
                              movq $1, -24(%rbp)  # BEGIN Calling assertBool  # Operation: AND64  # Int Literal: 1
                              movq $1, -32(%rbp)  # Int Literal: 1
                              movq -24(%rbp), %r15
                              movq -32(%rbp), %rbx
                              movq %r15, %r14
                              andq %rbx, %r14
                              movq %r14, -40(%rbp)
                              subq $48, %rsp
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              movq -40(%rbp), %r12  # Setting argument 1
                              push %r12
                              callq global_assertBool
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $56, %rsp  # END Calling assertBool
                              movq $1, -56(%rbp)  # BEGIN Calling assertBool  # Operation: OR64  # Int Literal: 1
                              movq $1, -64(%rbp)  # Int Literal: 1
                              movq -56(%rbp), %rbx
                              movq -64(%rbp), %r12
                              movq %rbx, %r15
                              orq %r12, %r15
                              movq %r15, -72(%rbp)
                              subq $80, %rsp
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              movq -72(%rbp), %r13  # Setting argument 1
                              push %r13
                              callq global_assertBool
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $88, %rsp  # END Calling assertBool
                              movq $1, -88(%rbp)  # BEGIN Calling assertBool  # BEGIN Calling not  # Operation: AND64  # Int Literal: 1
                              movq $0, -96(%rbp)  # Int Literal: 0
                              movq -88(%rbp), %r12
                              movq -96(%rbp), %r13
                              movq %r12, %rbx
                              andq %r13, %rbx
                              movq %rbx, -104(%rbp)
                              subq $112, %rsp
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              movq -104(%rbp), %r14  # Setting argument 1
                              push %r14
                              callq global_not
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $120, %rsp  # END Calling not
                              movq %rax, -120(%rbp)
                              subq $128, %rsp
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              movq -120(%rbp), %r15  # Setting argument 1
                              push %r15
                              callq global_assertBool
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $136, %rsp  # END Calling assertBool
                              movq $1, -136(%rbp)  # BEGIN Calling assertBool  # Operation: OR64  # Int Literal: 1
                              movq $0, -144(%rbp)  # Int Literal: 0
                              movq -136(%rbp), %r14
                              movq -144(%rbp), %r15
                              movq %r14, %r13
                              orq %r15, %r13
                              movq %r13, -152(%rbp)
                              subq $160, %rsp
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              movq -152(%rbp), %rbx  # Setting argument 1
                              push %rbx
                              callq global_assertBool
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $168, %rsp  # END Calling assertBool
                              movq $0, -168(%rbp)  # BEGIN Calling assertBool  # BEGIN Calling not  # Operation: AND64  # Int Literal: 0
                              movq $1, -176(%rbp)  # Int Literal: 1
                              movq -168(%rbp), %r15
                              movq -176(%rbp), %rbx
                              movq %r15, %r14
                              andq %rbx, %r14
                              movq %r14, -184(%rbp)
                              subq $192, %rsp
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              movq -184(%rbp), %r12  # Setting argument 1
                              push %r12
                              callq global_not
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $200, %rsp  # END Calling not
                              movq %rax, -200(%rbp)
                              subq $208, %rsp
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              movq -200(%rbp), %r13  # Setting argument 1
                              push %r13
                              callq global_assertBool
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $216, %rsp  # END Calling assertBool
                              movq $0, -216(%rbp)  # BEGIN Calling assertBool  # Operation: OR64  # Int Literal: 0
                              movq $1, -224(%rbp)  # Int Literal: 1
                              movq -216(%rbp), %r12
                              movq -224(%rbp), %r13
                              movq %r12, %rbx
                              orq %r13, %rbx
                              movq %rbx, -232(%rbp)
                              subq $240, %rsp
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              movq -232(%rbp), %r14  # Setting argument 1
                              push %r14
                              callq global_assertBool
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $248, %rsp  # END Calling assertBool
                              movq $0, -248(%rbp)  # BEGIN Calling assertBool  # BEGIN Calling not  # Operation: AND64  # Int Literal: 0
                              movq $0, -256(%rbp)  # Int Literal: 0
                              movq -248(%rbp), %r13
                              movq -256(%rbp), %r14
                              movq %r13, %r12
                              andq %r14, %r12
                              movq %r12, -264(%rbp)
                              subq $272, %rsp
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              movq -264(%rbp), %r15  # Setting argument 1
                              push %r15
                              callq global_not
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $280, %rsp  # END Calling not
                              movq %rax, -280(%rbp)
                              subq $288, %rsp
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              movq -280(%rbp), %rbx  # Setting argument 1
                              push %rbx
                              callq global_assertBool
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $296, %rsp  # END Calling assertBool
                              movq $0, -296(%rbp)  # BEGIN Calling assertBool  # BEGIN Calling not  # Operation: OR64  # Int Literal: 0
                              movq $0, -304(%rbp)  # Int Literal: 0
                              movq -296(%rbp), %r15
                              movq -304(%rbp), %rbx
                              movq %r15, %r14
                              orq %rbx, %r14
                              movq %r14, -312(%rbp)
                              subq $320, %rsp
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              movq -312(%rbp), %r12  # Setting argument 1
                              push %r12
                              callq global_not
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $328, %rsp  # END Calling not
                              movq %rax, -328(%rbp)
                              subq $336, %rsp
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              movq -328(%rbp), %r13  # Setting argument 1
                              push %r13
                              callq global_assertBool
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $344, %rsp  # END Calling assertBool
                              movq $3, -344(%rbp)  # BEGIN Calling assertBool  # Operation: GT64  # Int Literal: 3
                              movq $2, -352(%rbp)  # Int Literal: 2
                              movq -344(%rbp), %r12
                              movq -352(%rbp), %r13
                              cmpq %r13, %r12
                              setg %bl
                              andq $1, %rbx
                              movq %rbx, -360(%rbp)
                              subq $368, %rsp
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              movq -360(%rbp), %r14  # Setting argument 1
                              push %r14
                              callq global_assertBool
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $376, %rsp  # END Calling assertBool
                              movq $2, -376(%rbp)  # BEGIN Calling assertBool  # BEGIN Calling not  # Operation: GT64  # Int Literal: 2
                              movq $2, -384(%rbp)  # Int Literal: 2
                              movq -376(%rbp), %r13
                              movq -384(%rbp), %r14
                              cmpq %r14, %r13
                              setg %r12b
                              andq $1, %r12
                              movq %r12, -392(%rbp)
                              subq $400, %rsp
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              movq -392(%rbp), %r15  # Setting argument 1
                              push %r15
                              callq global_not
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $408, %rsp  # END Calling not
                              movq %rax, -408(%rbp)
                              subq $416, %rsp
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              movq -408(%rbp), %rbx  # Setting argument 1
                              push %rbx
                              callq global_assertBool
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $424, %rsp  # END Calling assertBool
                              movq $2, -424(%rbp)  # BEGIN Calling assertBool  # BEGIN Calling not  # Operation: GT64  # Int Literal: 2
                              movq $3, -432(%rbp)  # Int Literal: 3
                              movq -424(%rbp), %r15
                              movq -432(%rbp), %rbx
                              cmpq %rbx, %r15
                              setg %r14b
                              andq $1, %r14
                              movq %r14, -440(%rbp)
                              subq $448, %rsp
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              movq -440(%rbp), %r12  # Setting argument 1
                              push %r12
                              callq global_not
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $456, %rsp  # END Calling not
                              movq %rax, -456(%rbp)
                              subq $464, %rsp
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              movq -456(%rbp), %r13  # Setting argument 1
                              push %r13
                              callq global_assertBool
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $472, %rsp  # END Calling assertBool
                              movq $3, -472(%rbp)  # BEGIN Calling assertBool  # BEGIN Calling not  # Operation: LT64  # Int Literal: 3
                              movq $2, -480(%rbp)  # Int Literal: 2
                              movq -472(%rbp), %r12
                              movq -480(%rbp), %r13
                              cmpq %r13, %r12
                              setl %bl
                              andq $1, %rbx
                              movq %rbx, -488(%rbp)
                              subq $496, %rsp
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              movq -488(%rbp), %r14  # Setting argument 1
                              push %r14
                              callq global_not
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $504, %rsp  # END Calling not
                              movq %rax, -504(%rbp)
                              subq $512, %rsp
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              movq -504(%rbp), %r15  # Setting argument 1
                              push %r15
                              callq global_assertBool
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $520, %rsp  # END Calling assertBool
                              movq $2, -520(%rbp)  # BEGIN Calling assertBool  # BEGIN Calling not  # Operation: LT64  # Int Literal: 2
                              movq $2, -528(%rbp)  # Int Literal: 2
                              movq -520(%rbp), %r14
                              movq -528(%rbp), %r15
                              cmpq %r15, %r14
                              setl %r13b
                              andq $1, %r13
                              movq %r13, -536(%rbp)
                              subq $544, %rsp
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              movq -536(%rbp), %rbx  # Setting argument 1
                              push %rbx
                              callq global_not
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $552, %rsp  # END Calling not
                              movq %rax, -552(%rbp)
                              subq $560, %rsp
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              movq -552(%rbp), %r12  # Setting argument 1
                              push %r12
                              callq global_assertBool
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $568, %rsp  # END Calling assertBool
                              movq $2, -568(%rbp)  # BEGIN Calling assertBool  # Operation: LT64  # Int Literal: 2
                              movq $3, -576(%rbp)  # Int Literal: 3
                              movq -568(%rbp), %rbx
                              movq -576(%rbp), %r12
                              cmpq %r12, %rbx
                              setl %r15b
                              andq $1, %r15
                              movq %r15, -584(%rbp)
                              subq $592, %rsp
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              movq -584(%rbp), %r13  # Setting argument 1
                              push %r13
                              callq global_assertBool
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $600, %rsp  # END Calling assertBool
                              movq $3, -600(%rbp)  # BEGIN Calling assertBool  # Operation: GTE64  # Int Literal: 3
                              movq $2, -608(%rbp)  # Int Literal: 2
                              movq -600(%rbp), %r12
                              movq -608(%rbp), %r13
                              cmpq %r13, %r12
                              setge %bl
                              andq $1, %rbx
                              movq %rbx, -616(%rbp)
                              subq $624, %rsp
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              movq -616(%rbp), %r14  # Setting argument 1
                              push %r14
                              callq global_assertBool
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $632, %rsp  # END Calling assertBool
                              movq $2, -632(%rbp)  # BEGIN Calling assertBool  # Operation: GTE64  # Int Literal: 2
                              movq $2, -640(%rbp)  # Int Literal: 2
                              movq -632(%rbp), %r13
                              movq -640(%rbp), %r14
                              cmpq %r14, %r13
                              setge %r12b
                              andq $1, %r12
                              movq %r12, -648(%rbp)
                              subq $656, %rsp
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              movq -648(%rbp), %r15  # Setting argument 1
                              push %r15
                              callq global_assertBool
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $664, %rsp  # END Calling assertBool
                              movq $2, -664(%rbp)  # BEGIN Calling assertBool  # BEGIN Calling not  # Operation: GTE64  # Int Literal: 2
                              movq $3, -672(%rbp)  # Int Literal: 3
                              movq -664(%rbp), %r14
                              movq -672(%rbp), %r15
                              cmpq %r15, %r14
                              setge %r13b
                              andq $1, %r13
                              movq %r13, -680(%rbp)
                              subq $688, %rsp
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              movq -680(%rbp), %rbx  # Setting argument 1
                              push %rbx
                              callq global_not
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $696, %rsp  # END Calling not
                              movq %rax, -696(%rbp)
                              subq $704, %rsp
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              movq -696(%rbp), %r12  # Setting argument 1
                              push %r12
                              callq global_assertBool
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $712, %rsp  # END Calling assertBool
                              movq $3, -712(%rbp)  # BEGIN Calling assertBool  # BEGIN Calling not  # Operation: LTE64  # Int Literal: 3
                              movq $2, -720(%rbp)  # Int Literal: 2
                              movq -712(%rbp), %rbx
                              movq -720(%rbp), %r12
                              cmpq %r12, %rbx
                              setle %r15b
                              andq $1, %r15
                              movq %r15, -728(%rbp)
                              subq $736, %rsp
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              movq -728(%rbp), %r13  # Setting argument 1
                              push %r13
                              callq global_not
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $744, %rsp  # END Calling not
                              movq %rax, -744(%rbp)
                              subq $752, %rsp
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              movq -744(%rbp), %r14  # Setting argument 1
                              push %r14
                              callq global_assertBool
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $760, %rsp  # END Calling assertBool
                              movq $2, -760(%rbp)  # BEGIN Calling assertBool  # Operation: LTE64  # Int Literal: 2
                              movq $2, -768(%rbp)  # Int Literal: 2
                              movq -760(%rbp), %r13
                              movq -768(%rbp), %r14
                              cmpq %r14, %r13
                              setle %r12b
                              andq $1, %r12
                              movq %r12, -776(%rbp)
                              subq $784, %rsp
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              movq -776(%rbp), %r15  # Setting argument 1
                              push %r15
                              callq global_assertBool
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $792, %rsp  # END Calling assertBool
                              movq $2, -792(%rbp)  # BEGIN Calling assertBool  # Operation: LTE64  # Int Literal: 2
                              movq $3, -800(%rbp)  # Int Literal: 3
                              movq -792(%rbp), %r14
                              movq -800(%rbp), %r15
                              cmpq %r15, %r14
                              setle %r13b
                              andq $1, %r13
                              movq %r13, -808(%rbp)
                              subq $816, %rsp
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              movq -808(%rbp), %rbx  # Setting argument 1
                              push %rbx
                              callq global_assertBool
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $824, %rsp  # END Calling assertBool
                              movq $3, -824(%rbp)  # BEGIN Calling assertBool  # BEGIN Calling not  # Operation: EQ64  # Int Literal: 3
                              movq $2, -832(%rbp)  # Int Literal: 2
                              movq -824(%rbp), %r15
                              movq -832(%rbp), %rbx
                              cmpq %rbx, %r15
                              sete %r14b
                              andq $1, %r14
                              movq %r14, -840(%rbp)
                              subq $848, %rsp
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              movq -840(%rbp), %r12  # Setting argument 1
                              push %r12
                              callq global_not
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $856, %rsp  # END Calling not
                              movq %rax, -856(%rbp)
                              subq $864, %rsp
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              movq -856(%rbp), %r13  # Setting argument 1
                              push %r13
                              callq global_assertBool
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $872, %rsp  # END Calling assertBool
                              movq $2, -872(%rbp)  # BEGIN Calling assertBool  # Operation: EQ64  # Int Literal: 2
                              movq $2, -880(%rbp)  # Int Literal: 2
                              movq -872(%rbp), %r12
                              movq -880(%rbp), %r13
                              cmpq %r13, %r12
                              sete %bl
                              andq $1, %rbx
                              movq %rbx, -888(%rbp)
                              subq $896, %rsp
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              movq -888(%rbp), %r14  # Setting argument 1
                              push %r14
                              callq global_assertBool
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $904, %rsp  # END Calling assertBool
                              movq $3, -904(%rbp)  # BEGIN Calling assertBool  # Operation: NEQ64  # Int Literal: 3
                              movq $2, -912(%rbp)  # Int Literal: 2
                              movq -904(%rbp), %r13
                              movq -912(%rbp), %r14
                              cmpq %r14, %r13
                              setne %r12b
                              andq $1, %r12
                              movq %r12, -920(%rbp)
                              subq $928, %rsp
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              movq -920(%rbp), %r15  # Setting argument 1
                              push %r15
                              callq global_assertBool
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $936, %rsp  # END Calling assertBool
                              movq $2, -936(%rbp)  # BEGIN Calling assertBool  # BEGIN Calling not  # Operation: NEQ64  # Int Literal: 2
                              movq $2, -944(%rbp)  # Int Literal: 2
                              movq -936(%rbp), %r14
                              movq -944(%rbp), %r15
                              cmpq %r15, %r14
                              setne %r13b
                              andq $1, %r13
                              movq %r13, -952(%rbp)
                              subq $960, %rsp
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              movq -952(%rbp), %rbx  # Setting argument 1
                              push %rbx
                              callq global_not
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $968, %rsp  # END Calling not
                              movq %rax, -968(%rbp)
                              subq $976, %rsp
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              movq -968(%rbp), %r12  # Setting argument 1
                              push %r12
                              callq global_assertBool
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $984, %rsp  # END Calling assertBool
                              movq $2, -984(%rbp)  # BEGIN Calling assert  # Operation: ADD64  # Int Literal: 2
                              movq $3, -992(%rbp)  # Int Literal: 3
                              movq -984(%rbp), %rbx
                              movq -992(%rbp), %r12
                              movq %rbx, %r15
                              addq %r12, %r15
                              movq %r15, -1000(%rbp)
                              movq $5, -1008(%rbp)  # Int Literal: 5
                              subq $1032, %rsp
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              movq -1000(%rbp), %r14  # Setting argument 1
                              push %r14
                              movq -1008(%rbp), %r14  # Setting argument 2
                              push %r14
                              callq global_assert
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $1048, %rsp  # END Calling assert
                              movq $2, -1032(%rbp)  # BEGIN Calling assert  # Operation: SUB64  # Int Literal: 2
                              movq $3, -1040(%rbp)  # Int Literal: 3
                              movq -1032(%rbp), %r13
                              movq -1040(%rbp), %r14
                              movq %r13, %r12
                              subq %r14, %r12
                              movq %r12, -1048(%rbp)
                              movq $1, -1056(%rbp)  # Operation: NEG64  # Int Literal: 1
                              movq -1056(%rbp), %rbx
                              neg %rbx
                              movq %rbx, -1064(%rbp)
                              subq $1080, %rsp
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              movq -1048(%rbp), %r14  # Setting argument 1
                              push %r14
                              movq -1064(%rbp), %r14  # Setting argument 2
                              push %r14
                              callq global_assert
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $1096, %rsp  # END Calling assert
                              movq $2, -1088(%rbp)  # BEGIN Calling assert  # Operation: MULT64  # Int Literal: 2
                              movq $3, -1096(%rbp)  # Int Literal: 3
                              movq -1088(%rbp), %r13
                              movq -1096(%rbp), %rax
                              imulq %r13
                              movq %rax, -1104(%rbp)
                              movq $6, -1112(%rbp)  # Int Literal: 6
                              subq $1128, %rsp
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              movq -1104(%rbp), %rbx  # Setting argument 1
                              push %rbx
                              movq -1112(%rbp), %rbx  # Setting argument 2
                              push %rbx
                              callq global_assert
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $1144, %rsp  # END Calling assert
                              movq $9, -1136(%rbp)  # BEGIN Calling assert  # Operation: DIV64  # Int Literal: 9
                              movq $4, -1144(%rbp)  # Int Literal: 4
                              movq -1136(%rbp), %r15
                              movq -1144(%rbp), %rbx
                              movq $0, %rdx
                              movq %r15, %rax
                              idivq %rbx
                              movq %rax, -1152(%rbp)
                              movq $2, -1160(%rbp)  # Int Literal: 2
                              subq $1176, %rsp
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              movq -1152(%rbp), %r13  # Setting argument 1
                              push %r13
                              movq -1160(%rbp), %r13  # Setting argument 2
                              push %r13
                              callq global_assert
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $1192, %rsp  # END Calling assert
lbl_21:                       leave  # END Function body
                              retq


global_testShadowingHelper:   push %rbp
                              movq %rsp, %rbp  # BEGIN Function body
                              movq $4, -24(%rbp)  # Int Literal: 4
                              movq -24(%rbp), %r12
                              movq %r12, global_var  # BEGIN Assigning var  # END Assigning var
                              movq $0, -32(%rbp)  # Initializing var
                              movq $2, -40(%rbp)  # Int Literal: 2
                              movq -40(%rbp), %r14
                              movq %r14, -32(%rbp)  # BEGIN Assigning var  # END Assigning var
                              movq -32(%rbp), %rax  # BEGIN Return
lbl_22:                       leave  # END Function body
                              retq


global_testShadowing:         push %rbp
                              movq %rsp, %rbp  # BEGIN Function body
                              movq $0, -24(%rbp)  # Initializing returnValue
                              subq $24, %rsp  # BEGIN Calling testShadowingHelper
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq global_testShadowingHelper
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $24, %rsp  # END Calling testShadowingHelper
                              movq %rax, -32(%rbp)
                              movq -32(%rbp), %r12
                              movq %r12, -24(%rbp)  # BEGIN Assigning returnValue  # END Assigning returnValue
                              movq $4, -40(%rbp)  # BEGIN Calling assert  # Int Literal: 4
                              subq $56, %rsp
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              movq global_var, %r14  # Setting argument 1
                              push %r14
                              movq -40(%rbp), %r14  # Setting argument 2
                              push %r14
                              callq global_assert
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $72, %rsp  # END Calling assert
                              movq $2, -64(%rbp)  # BEGIN Calling assert  # Int Literal: 2
                              subq $88, %rsp
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              movq -24(%rbp), %rbx  # Setting argument 1
                              push %rbx
                              movq -64(%rbp), %rbx  # Setting argument 2
                              push %rbx
                              callq global_assert
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $104, %rsp  # END Calling assert
lbl_23:                       leave  # END Function body
                              retq


global_testLongExpression:    push %rbp
                              movq %rsp, %rbp  # BEGIN Function body
                              movq 16(%rbp), %rbx  # Getting argument "isFirstCall"
                              movq %rbx, -24(%rbp)
                              movq $0, -32(%rbp)  # Initializing a
                              movq $1, -40(%rbp)  # Int Literal: 1
                              movq -40(%rbp), %r12
                              movq %r12, -32(%rbp)  # BEGIN Assigning a  # END Assigning a
                              movq $0, -48(%rbp)  # Initializing b
                              movq $2, -56(%rbp)  # Int Literal: 2
                              movq -56(%rbp), %r14
                              movq %r14, -48(%rbp)  # BEGIN Assigning b  # END Assigning b
                              movq $0, -64(%rbp)  # Initializing c
                              movq $3, -72(%rbp)  # Int Literal: 3
                              movq -72(%rbp), %rbx
                              movq %rbx, -64(%rbp)  # BEGIN Assigning c  # END Assigning c
                              movq $0, -80(%rbp)  # Initializing d
                              movq $4, -88(%rbp)  # Int Literal: 4
                              movq -88(%rbp), %r13
                              movq %r13, -80(%rbp)  # BEGIN Assigning d  # END Assigning d
                              movq $0, -96(%rbp)  # Initializing e
                              movq $5, -104(%rbp)  # Int Literal: 5
                              movq -104(%rbp), %r15
                              movq %r15, -96(%rbp)  # BEGIN Assigning e  # END Assigning e
                              movq $0, -112(%rbp)  # Initializing f
                              movq $6, -120(%rbp)  # Int Literal: 6
                              movq -120(%rbp), %r12
                              movq %r12, -112(%rbp)  # BEGIN Assigning f  # END Assigning f
                              movq $0, -128(%rbp)  # Initializing g
                              movq $7, -136(%rbp)  # Int Literal: 7
                              movq -136(%rbp), %r14
                              movq %r14, -128(%rbp)  # BEGIN Assigning g  # END Assigning g
                              movq -24(%rbp), %r15  # BEGIN if  # BEGIN If Condition
                              cmpq $0, %r15
                              je lbl_25  # END If Condition
                              movq -32(%rbp), %r13  # BEGIN True Branch  # Operation: SUB64  # Operation: MULT64  # Operation: ADD64
                              movq -48(%rbp), %r14
                              movq %r13, %r12
                              addq %r14, %r12
                              movq %r12, -144(%rbp)
                              movq -80(%rbp), %rbx  # Operation: DIV64
                              movq -64(%rbp), %r12
                              movq $0, %rdx
                              movq %rbx, %rax
                              idivq %r12
                              movq %rax, -152(%rbp)
                              movq -144(%rbp), %r14
                              movq -152(%rbp), %rax
                              imulq %r14
                              movq %rax, -160(%rbp)
                              movq $0, -168(%rbp)  # Operation: DIV64  # BEGIN Calling testLongExpression  # Int Literal: 0
                              subq $176, %rsp
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              movq -168(%rbp), %r12  # Setting argument 1
                              push %r12
                              callq global_testLongExpression
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $184, %rsp  # END Calling testLongExpression
                              movq %rax, -184(%rbp)
                              movq -184(%rbp), %r14
                              movq -96(%rbp), %r15
                              movq $0, %rdx
                              movq %r14, %rax
                              idivq %r15
                              movq %rax, -192(%rbp)
                              movq -160(%rbp), %r12
                              movq -192(%rbp), %r13
                              movq %r12, %rbx
                              subq %r13, %rbx
                              movq %rbx, -200(%rbp)
                              movq -200(%rbp), %rbx
                              movq %rbx, -32(%rbp)  # BEGIN Assigning a  # END Assigning a
                              movq $2, -208(%rbp)  # BEGIN Calling assert  # Operation: NEG64  # Int Literal: 2
                              movq -208(%rbp), %r15
                              neg %r15
                              movq %r15, -216(%rbp)
                              subq $232, %rsp
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              movq -32(%rbp), %r13  # Setting argument 1
                              push %r13
                              movq -216(%rbp), %r13  # Setting argument 2
                              push %r13
                              callq global_assert
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $248, %rsp  # END True Branch  # END Calling assert
                              jmp lbl_26
lbl_25:                       movq -112(%rbp), %rbx  # BEGIN False Branch  # Operation: ADD64  # Operation: ADD64  # Operation: ADD64  # Operation: ADD64  # Operation: ADD64  # Operation: ADD64
                              movq -128(%rbp), %r12
                              movq %rbx, %r15
                              addq %r12, %r15
                              movq %r15, -240(%rbp)
                              movq -96(%rbp), %r14
                              movq -240(%rbp), %r15
                              movq %r14, %r13
                              addq %r15, %r13
                              movq %r13, -248(%rbp)
                              movq -80(%rbp), %r12
                              movq -248(%rbp), %r13
                              movq %r12, %rbx
                              addq %r13, %rbx
                              movq %rbx, -256(%rbp)
                              movq -64(%rbp), %r15
                              movq -256(%rbp), %rbx
                              movq %r15, %r14
                              addq %rbx, %r14
                              movq %r14, -264(%rbp)
                              movq -48(%rbp), %r13
                              movq -264(%rbp), %r14
                              movq %r13, %r12
                              addq %r14, %r12
                              movq %r12, -272(%rbp)
                              movq -32(%rbp), %rbx
                              movq -272(%rbp), %r12
                              movq %rbx, %r15
                              addq %r12, %r15
                              movq %r15, -280(%rbp)
                              movq -280(%rbp), %r14
                              movq %r14, -32(%rbp)  # BEGIN Assigning a  # END Assigning a
                              movq $28, -288(%rbp)  # BEGIN Calling assert  # Int Literal: 28
                              subq $312, %rsp
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              movq -32(%rbp), %r14  # Setting argument 1
                              push %r14
                              movq -288(%rbp), %r14  # Setting argument 2
                              push %r14
                              callq global_assert
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $328, %rsp  # END Calling assert
                              movq -32(%rbp), %rax  # BEGIN Return
lbl_26:                       leave  # END Function body
                              retq


global_tonOfArguments:        push %rbp
                              movq %rsp, %rbp  # BEGIN Function body
                              movq 64(%rbp), %rbx  # Getting argument "a"
                              movq %rbx, -24(%rbp)
                              movq 56(%rbp), %rbx  # Getting argument "b"
                              movq %rbx, -32(%rbp)
                              movq 48(%rbp), %rbx  # Getting argument "c"
                              movq %rbx, -40(%rbp)
                              movq 40(%rbp), %rbx  # Getting argument "d"
                              movq %rbx, -48(%rbp)
                              movq 32(%rbp), %rbx  # Getting argument "e"
                              movq %rbx, -56(%rbp)
                              movq 24(%rbp), %rbx  # Getting argument "f"
                              movq %rbx, -64(%rbp)
                              movq 16(%rbp), %rbx  # Getting argument "g"
                              movq %rbx, -72(%rbp)
                              movq -24(%rbp), %rdi  # BEGIN Output
                              subq $72, %rsp  # BEGIN Calling printInt
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq printInt
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $72, %rsp  # END Output  # END Calling printInt
                              movq $str_1, %rdi  # BEGIN Output  # String Literal: "\n"
                              subq $72, %rsp  # BEGIN Calling printString
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq printString
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $72, %rsp  # END Output  # END Calling printString
                              movq -32(%rbp), %rdi  # BEGIN Output
                              subq $72, %rsp  # BEGIN Calling printInt
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq printInt
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $72, %rsp  # END Output  # END Calling printInt
                              movq $str_1, %rdi  # BEGIN Output  # String Literal: "\n"
                              subq $72, %rsp  # BEGIN Calling printString
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq printString
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $72, %rsp  # END Output  # END Calling printString
                              movq -40(%rbp), %rdi  # BEGIN Output
                              subq $72, %rsp  # BEGIN Calling printInt
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq printInt
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $72, %rsp  # END Output  # END Calling printInt
                              movq $str_1, %rdi  # BEGIN Output  # String Literal: "\n"
                              subq $72, %rsp  # BEGIN Calling printString
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq printString
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $72, %rsp  # END Output  # END Calling printString
                              movq -48(%rbp), %rdi  # BEGIN Output
                              subq $72, %rsp  # BEGIN Calling printInt
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq printInt
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $72, %rsp  # END Output  # END Calling printInt
                              movq $str_1, %rdi  # BEGIN Output  # String Literal: "\n"
                              subq $72, %rsp  # BEGIN Calling printString
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq printString
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $72, %rsp  # END Output  # END Calling printString
                              movq -56(%rbp), %rdi  # BEGIN Output
                              subq $72, %rsp  # BEGIN Calling printInt
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq printInt
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $72, %rsp  # END Output  # END Calling printInt
                              movq $str_1, %rdi  # BEGIN Output  # String Literal: "\n"
                              subq $72, %rsp  # BEGIN Calling printString
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq printString
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $72, %rsp  # END Output  # END Calling printString
                              movq -64(%rbp), %rdi  # BEGIN Output
                              subq $72, %rsp  # BEGIN Calling printInt
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq printInt
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $72, %rsp  # END Output  # END Calling printInt
                              movq $str_1, %rdi  # BEGIN Output  # String Literal: "\n"
                              subq $72, %rsp  # BEGIN Calling printString
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq printString
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $72, %rsp  # END Output  # END Calling printString
                              movq -72(%rbp), %rdi  # BEGIN Output
                              subq $72, %rsp  # BEGIN Calling printInt
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq printInt
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $72, %rsp  # END Output  # END Calling printInt
                              movq $str_1, %rdi  # BEGIN Output  # String Literal: "\n"
                              subq $72, %rsp  # BEGIN Calling printString
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq printString
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $72, %rsp  # END Output  # END Calling printString
lbl_27:                       leave  # END Function body
                              retq


global_testTonOfArguments:    push %rbp
                              movq %rsp, %rbp  # BEGIN Function body
                              movq $11, -24(%rbp)  # BEGIN Calling tonOfArguments  # Int Literal: 11
                              movq $22, -32(%rbp)  # Int Literal: 22
                              movq $33, -40(%rbp)  # Int Literal: 33
                              movq $44, -48(%rbp)  # Int Literal: 44
                              movq $55, -56(%rbp)  # Int Literal: 55
                              movq $66, -64(%rbp)  # Int Literal: 66
                              movq $77, -72(%rbp)  # Int Literal: 77
                              subq $128, %rsp
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              movq -24(%rbp), %r14  # Setting argument 1
                              push %r14
                              movq -32(%rbp), %r14  # Setting argument 2
                              push %r14
                              movq -40(%rbp), %r14  # Setting argument 3
                              push %r14
                              movq -48(%rbp), %r14  # Setting argument 4
                              push %r14
                              movq -56(%rbp), %r14  # Setting argument 5
                              push %r14
                              movq -64(%rbp), %r14  # Setting argument 6
                              push %r14
                              movq -72(%rbp), %r14  # Setting argument 7
                              push %r14
                              callq global_tonOfArguments
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $184, %rsp  # END Calling tonOfArguments
lbl_28:                       leave  # END Function body
                              retq


main:                         push %rbp
                              movq %rsp, %rbp  # BEGIN Function body
                              subq $24, %rsp  # BEGIN Calling printTestHeader
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq global_printTestHeader
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $24, %rsp  # END Calling printTestHeader
                              subq $24, %rsp  # BEGIN Calling testOperators
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq global_testOperators
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $24, %rsp  # END Calling testOperators
                              subq $24, %rsp  # BEGIN Calling printTestHeader
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq global_printTestHeader
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $24, %rsp  # END Calling printTestHeader
                              subq $24, %rsp  # BEGIN Calling testLoops
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq global_testLoops
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $24, %rsp  # END Calling testLoops
                              subq $24, %rsp  # BEGIN Calling printTestHeader
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq global_printTestHeader
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $24, %rsp  # END Calling printTestHeader
                              subq $24, %rsp  # BEGIN Calling testTonOfArguments
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq global_testTonOfArguments
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $24, %rsp  # END Calling testTonOfArguments
                              subq $24, %rsp  # BEGIN Calling printTestHeader
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq global_printTestHeader
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $24, %rsp  # END Calling printTestHeader
                              subq $24, %rsp  # BEGIN Calling testShadowing
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq global_testShadowing
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $24, %rsp  # END Calling testShadowing
                              subq $24, %rsp  # BEGIN Calling printTestHeader
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq global_printTestHeader
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $24, %rsp  # END Calling printTestHeader
                              movq $1, -24(%rbp)  # BEGIN Calling testLongExpression  # Int Literal: 1
                              subq $32, %rsp
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              movq -24(%rbp), %r13  # Setting argument 1
                              push %r13
                              callq global_testLongExpression
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $40, %rsp  # END Calling testLongExpression
                              subq $40, %rsp  # BEGIN Calling printTestHeader
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq global_printTestHeader
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $40, %rsp  # END Calling printTestHeader
                              subq $40, %rsp  # BEGIN Calling testFunctionPointers
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq global_testFunctionPointers
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $40, %rsp  # END Calling testFunctionPointers
                              subq $40, %rsp  # BEGIN Calling printSummary
                              push %rbx
                              push %r12
                              push %r13
                              push %r14
                              push %r15
                              callq global_printSummary
                              popq %r15
                              popq %r14
                              popq %r13
                              popq %r12
                              popq %rbx
                              addq $40, %rsp  # END Calling printSummary
lbl_29:                       leave  # END Function body
                              retq
