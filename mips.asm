.globl _start
.data
global_globalPointer:         .word 0
global_failCount:             .word 0
global_totalCount:            .word 0
global_testNumber:            .word 0
global_var:                   .word 0
str_0:                        .asciiz "left_"
str_1:                        .asciiz "\n"
str_2:                        .asciiz "right_"
str_3:                        .asciiz "Calling a function using pointer:\n"
str_4:                        .asciiz "Function as an actual:\n"
str_5:                        .asciiz "Calling a function returned from another function:\n"
str_6:                        .asciiz "Test #"
str_7:                        .asciiz ": "
str_8:                        .asciiz "Pass\n"
str_9:                        .asciiz "Fail\n"
str_10:                       .asciiz "FAIL\n"
str_11:                       .asciiz "Expected: "
str_12:                       .asciiz "\nReceived:"
str_13:                       .asciiz "\n\n"
str_14:                       .asciiz "Passed "
str_15:                       .asciiz " of "
str_16:                       .asciiz " tests"
str_17:                       .asciiz "Section #"
str_18:                       .asciiz ":\n"
.text
_start:                       jal global_main
                              li $v0, 10  # Exit syscall
                              syscall

_get_pc:                      move $v0, $ra  # A helper function for getting current PC
                              jr $ra

global_break:                 sw $fp, -4($sp)  # Save frame pointer
                              move $fp, $sp  # Set new frame pointer
                              sw $ra, -8($fp)  # Save return address  # BEGIN Function body
lbl_0:                        lw $ra, -8($fp)  # END Function body  # Restore return address
                              lw $fp, -4($fp)  # Restore frame pointer
                              jr $ra  # Return to caller


global_left:                  sw $fp, -4($sp)  # Save frame pointer
                              move $fp, $sp  # Set new frame pointer
                              sw $ra, -8($fp)  # Save return address  # BEGIN Function body
                              lw $t0, 0($fp)  # Getting argument "a"
                              sw $t0, -12($fp)
                              la $a0, str_0  # BEGIN Output  # String Literal: "left_"
                              addi $v0, $zero, 4
                              syscall  # END Output
                              lw $a0, -12($fp)  # BEGIN Output
                              addi $v0, $zero, 1
                              syscall  # END Output
                              la $a0, str_1  # BEGIN Output  # String Literal: "\n"
                              addi $v0, $zero, 4
                              syscall  # END Output
lbl_1:                        lw $ra, -8($fp)  # END Function body  # Restore return address
                              lw $fp, -4($fp)  # Restore frame pointer
                              jr $ra  # Return to caller


global_right:                 sw $fp, -4($sp)  # Save frame pointer
                              move $fp, $sp  # Set new frame pointer
                              sw $ra, -8($fp)  # Save return address  # BEGIN Function body
                              lw $t0, 0($fp)  # Getting argument "a"
                              sw $t0, -12($fp)
                              la $a0, str_2  # BEGIN Output  # String Literal: "right_"
                              addi $v0, $zero, 4
                              syscall  # END Output
                              lw $a0, -12($fp)  # BEGIN Output
                              addi $v0, $zero, 1
                              syscall  # END Output
                              la $a0, str_1  # BEGIN Output  # String Literal: "\n"
                              addi $v0, $zero, 4
                              syscall  # END Output
lbl_2:                        lw $ra, -8($fp)  # END Function body  # Restore return address
                              lw $fp, -4($fp)  # Restore frame pointer
                              jr $ra  # Return to caller


global_twice:                 sw $fp, -4($sp)  # Save frame pointer
                              move $fp, $sp  # Set new frame pointer
                              sw $ra, -8($fp)  # Save return address  # BEGIN Function body
                              lw $t0, 4($fp)  # Getting argument "f"
                              sw $t0, -12($fp)
                              lw $t0, 0($fp)  # Getting argument "a"
                              sw $t0, -16($fp)
                              lw $t1, -16($fp)  # Setting argument 1
                              sw $t1, -20($fp)
                              addi $sp, $sp, -20  # BEGIN Calling f
                              jal _get_pc  # Calling function by pointer
                              move $ra, $v0
                              addi $ra, $ra, 16  # Offset the return position
                              lw $v0, -12($fp)
                              jr $v0
                              addi $sp, $sp, 20  # END Calling f
                              lw $t2, -16($fp)  # Setting argument 1
                              sw $t2, -24($fp)
                              addi $sp, $sp, -24  # BEGIN Calling f
                              jal _get_pc  # Calling function by pointer
                              move $ra, $v0
                              addi $ra, $ra, 16  # Offset the return position
                              lw $v0, -12($fp)
                              jr $v0
                              addi $sp, $sp, 24  # END Calling f
                              lw $v0, -12($fp)  # BEGIN Return
lbl_3:                        lw $ra, -8($fp)  # END Function body  # Restore return address
                              lw $fp, -4($fp)  # Restore frame pointer
                              jr $ra  # Return to caller


global_testFunctionPointers:  sw $fp, -4($sp)  # Save frame pointer
                              move $fp, $sp  # Set new frame pointer
                              sw $ra, -8($fp)  # Save return address  # BEGIN Function body
                              sw $zero, -12($fp)  # Initializing localPointer
                              sw $zero, -16($fp)  # Initializing a
                              addi $v0, $zero, 41  # BEGIN Mayhem
                              move $a0, $zero
                              syscall
                              sw $a0, -20($fp)  # END Mayhem
                              lw $t1, -20($fp)
                              sw $t1, -16($fp)  # BEGIN Assigning a  # END Assigning a
                              sw $zero, -24($fp)  # Initializing b
                              addi $v0, $zero, 41  # BEGIN Mayhem
                              move $a0, $zero
                              syscall
                              sw $a0, -28($fp)  # END Mayhem
                              lw $t2, -28($fp)
                              sw $t2, -24($fp)  # BEGIN Assigning b  # END Assigning b
                              lw $t4, -16($fp)  # BEGIN if  # BEGIN If Condition  # Operation: GT64
                              lw $t5, -24($fp)
                              slt $t3, $t5, $t4
                              sw $t3, -32($fp)
                              lw $t0, -32($fp)
                              beq $zero, $t0, lbl_5  # END If Condition
                              la $t6, global_left  # BEGIN True Branch
                              sw $t6, global_globalPointer  # BEGIN Assigning globalPointer  # END Assigning globalPointer
                              la $t7, global_right
                              sw $t7, -12($fp)  # BEGIN Assigning localPointer  # END True Branch  # END Assigning localPointer
                              j lbl_6
lbl_5:                        la $t8, global_right  # BEGIN False Branch
                              sw $t8, global_globalPointer  # BEGIN Assigning globalPointer  # END Assigning globalPointer
                              la $t9, global_left
                              sw $t9, -12($fp)  # BEGIN Assigning localPointer  # END if  # END False Branch  # END Assigning localPointer
lbl_6:                        addi $sp, $sp, -32  # BEGIN Calling break
                              jal global_break
                              addi $sp, $sp, 32  # END Calling break
                              la $a0, str_3  # BEGIN Output  # String Literal: "Calling a function using pointer:\n"
                              addi $v0, $zero, 4
                              syscall  # END Output
                              lw $t1, -24($fp)  # Setting argument 1
                              sw $t1, -36($fp)
                              addi $sp, $sp, -36  # BEGIN Calling localPointer
                              jal _get_pc  # Calling function by pointer
                              move $ra, $v0
                              addi $ra, $ra, 16  # Offset the return position
                              lw $v0, -12($fp)
                              jr $v0
                              addi $sp, $sp, 36  # END Calling localPointer
                              sw $zero, -40($fp)  # Initializing result
                              la $a0, str_4  # BEGIN Output  # String Literal: "Function as an actual:\n"
                              addi $v0, $zero, 4
                              syscall  # END Output
                              lw $t3, global_globalPointer  # Setting argument 1
                              sw $t3, -44($fp)
                              lw $t3, -16($fp)  # Setting argument 2
                              sw $t3, -48($fp)
                              addi $sp, $sp, -48  # BEGIN Calling twice
                              jal global_twice
                              addi $sp, $sp, 48  # END Calling twice
                              sw $v0, -52($fp)
                              lw $t2, -52($fp)
                              sw $t2, -40($fp)  # BEGIN Assigning result  # END Assigning result
                              la $a0, str_5  # BEGIN Output  # String Literal: "Calling a function returned from another function:\n"
                              addi $v0, $zero, 4
                              syscall  # END Output
                              lw $t4, -16($fp)  # Setting argument 1
                              sw $t4, -56($fp)
                              addi $sp, $sp, -56  # BEGIN Calling result
                              jal _get_pc  # Calling function by pointer
                              move $ra, $v0
                              addi $ra, $ra, 16  # Offset the return position
                              lw $v0, -40($fp)
                              jr $v0
                              addi $sp, $sp, 56  # END Calling result
lbl_4:                        lw $ra, -8($fp)  # END Function body  # Restore return address
                              lw $fp, -4($fp)  # Restore frame pointer
                              jr $ra  # Return to caller


global_assertBool:            sw $fp, -4($sp)  # Save frame pointer
                              move $fp, $sp  # Set new frame pointer
                              sw $ra, -8($fp)  # Save return address  # BEGIN Function body
                              lw $t0, 0($fp)  # Getting argument "result"
                              sw $t0, -12($fp)
                              li $t2, 1  # BEGIN PostInc  # Int Literal: 1
                              sw $t2, -16($fp)
                              lw $t1, global_totalCount
                              add $t1, $t1, $t2
                              sw $t1, global_totalCount  # END PostInc
                              la $a0, str_6  # BEGIN Output  # String Literal: "Test #"
                              addi $v0, $zero, 4
                              syscall  # END Output
                              lw $a0, global_totalCount  # BEGIN Output
                              addi $v0, $zero, 1
                              syscall  # END Output
                              la $a0, str_7  # BEGIN Output  # String Literal: ": "
                              addi $v0, $zero, 4
                              syscall  # END Output
                              lw $t5, -12($fp)  # BEGIN if  # BEGIN If Condition
                              beq $zero, $t5, lbl_8  # END If Condition
                              la $a0, str_8  # BEGIN True Branch  # BEGIN Output  # String Literal: "Pass\n"
                              addi $v0, $zero, 4
                              syscall  # END True Branch  # END Output
                              j lbl_9
lbl_8:                        la $a0, str_9  # BEGIN False Branch  # BEGIN Output  # String Literal: "Fail\n"
                              addi $v0, $zero, 4
                              syscall  # END Output
                              li $t4, 1  # BEGIN PostInc  # Int Literal: 1
                              sw $t4, -20($fp)
                              lw $t3, global_failCount
                              add $t3, $t3, $t4
                              sw $t3, global_failCount  # END if  # END False Branch  # END PostInc
lbl_9:                        lw $ra, -8($fp)  # END Function body  # Restore return address
                              lw $fp, -4($fp)  # Restore frame pointer
                              jr $ra  # Return to caller


global_not:                   sw $fp, -4($sp)  # Save frame pointer
                              move $fp, $sp  # Set new frame pointer
                              sw $ra, -8($fp)  # Save return address  # BEGIN Function body
                              lw $t0, 0($fp)  # Getting argument "a"
                              sw $t0, -12($fp)
                              lw $t3, -12($fp)  # BEGIN Return  # Operation: NOT64
                              sltiu $t1, $t3, 1
                              andi $t1, $t1, 0x00ff
                              sw $t1, -16($fp)
                              lw $v0, -16($fp)
lbl_10:                       lw $ra, -8($fp)  # END Function body  # Restore return address
                              lw $fp, -4($fp)  # Restore frame pointer
                              jr $ra  # Return to caller


global_assert:                sw $fp, -4($sp)  # Save frame pointer
                              move $fp, $sp  # Set new frame pointer
                              sw $ra, -8($fp)  # Save return address  # BEGIN Function body
                              lw $t0, 4($fp)  # Getting argument "result"
                              sw $t0, -12($fp)
                              lw $t0, 0($fp)  # Getting argument "expected"
                              sw $t0, -16($fp)
                              li $t2, 1  # BEGIN PostInc  # Int Literal: 1
                              sw $t2, -20($fp)
                              lw $t1, global_totalCount
                              add $t1, $t1, $t2
                              sw $t1, global_totalCount  # END PostInc
                              la $a0, str_6  # BEGIN Output  # String Literal: "Test #"
                              addi $v0, $zero, 4
                              syscall  # END Output
                              lw $a0, global_totalCount  # BEGIN Output
                              addi $v0, $zero, 1
                              syscall  # END Output
                              la $a0, str_7  # BEGIN Output  # String Literal: ": "
                              addi $v0, $zero, 4
                              syscall  # END Output
                              lw $t4, -12($fp)  # BEGIN if  # BEGIN If Condition  # Operation: EQ64
                              lw $t5, -16($fp)
                              xor $t3, $t4, $t5
                              sltiu $t3, $t3, 1
                              sw $t3, -24($fp)
                              lw $t8, -24($fp)
                              beq $zero, $t8, lbl_12  # END If Condition
                              la $a0, str_8  # BEGIN True Branch  # BEGIN Output  # String Literal: "Pass\n"
                              addi $v0, $zero, 4
                              syscall  # END True Branch  # END Output
                              j lbl_13
lbl_12:                       la $a0, str_10  # BEGIN False Branch  # BEGIN Output  # String Literal: "FAIL\n"
                              addi $v0, $zero, 4
                              syscall  # END Output
                              la $a0, str_11  # BEGIN Output  # String Literal: "Expected: "
                              addi $v0, $zero, 4
                              syscall  # END Output
                              lw $a0, -16($fp)  # BEGIN Output
                              addi $v0, $zero, 1
                              syscall  # END Output
                              la $a0, str_12  # BEGIN Output  # String Literal: "\nReceived:"
                              addi $v0, $zero, 4
                              syscall  # END Output
                              lw $a0, -12($fp)  # BEGIN Output
                              addi $v0, $zero, 1
                              syscall  # END Output
                              la $a0, str_13  # BEGIN Output  # String Literal: "\n\n"
                              addi $v0, $zero, 4
                              syscall  # END Output
                              li $t7, 1  # BEGIN PostInc  # Int Literal: 1
                              sw $t7, -28($fp)
                              lw $t6, global_failCount
                              add $t6, $t6, $t7
                              sw $t6, global_failCount  # END if  # END False Branch  # END PostInc
lbl_13:                       lw $ra, -8($fp)  # END Function body  # Restore return address
                              lw $fp, -4($fp)  # Restore frame pointer
                              jr $ra  # Return to caller


global_printSummary:          sw $fp, -4($sp)  # Save frame pointer
                              move $fp, $sp  # Set new frame pointer
                              sw $ra, -8($fp)  # Save return address  # BEGIN Function body
                              la $a0, str_14  # BEGIN Output  # String Literal: "Passed "
                              addi $v0, $zero, 4
                              syscall  # END Output
                              lw $t2, global_totalCount  # BEGIN Output  # Operation: SUB64
                              lw $t3, global_failCount
                              sub $t1, $t2, $t3
                              sw $t1, -12($fp)
                              lw $a0, -12($fp)
                              addi $v0, $zero, 1
                              syscall  # END Output
                              la $a0, str_15  # BEGIN Output  # String Literal: " of "
                              addi $v0, $zero, 4
                              syscall  # END Output
                              lw $a0, global_totalCount  # BEGIN Output
                              addi $v0, $zero, 1
                              syscall  # END Output
                              la $a0, str_16  # BEGIN Output  # String Literal: " tests"
                              addi $v0, $zero, 4
                              syscall  # END Output
lbl_14:                       lw $ra, -8($fp)  # END Function body  # Restore return address
                              lw $fp, -4($fp)  # Restore frame pointer
                              jr $ra  # Return to caller


global_printTestHeader:       sw $fp, -4($sp)  # Save frame pointer
                              move $fp, $sp  # Set new frame pointer
                              sw $ra, -8($fp)  # Save return address  # BEGIN Function body
                              li $t2, 1  # BEGIN PostInc  # Int Literal: 1
                              sw $t2, -12($fp)
                              lw $t1, global_testNumber
                              add $t1, $t1, $t2
                              sw $t1, global_testNumber  # END PostInc
                              la $a0, str_17  # BEGIN Output  # String Literal: "Section #"
                              addi $v0, $zero, 4
                              syscall  # END Output
                              lw $a0, global_testNumber  # BEGIN Output
                              addi $v0, $zero, 1
                              syscall  # END Output
                              la $a0, str_18  # BEGIN Output  # String Literal: ":\n"
                              addi $v0, $zero, 4
                              syscall  # END Output
lbl_15:                       lw $ra, -8($fp)  # END Function body  # Restore return address
                              lw $fp, -4($fp)  # Restore frame pointer
                              jr $ra  # Return to caller


global_testLoops:             sw $fp, -4($sp)  # Save frame pointer
                              move $fp, $sp  # Set new frame pointer
                              sw $ra, -8($fp)  # Save return address  # BEGIN Function body
                              sw $zero, -12($fp)  # BEGIN for loop  # Initializing i
lbl_17:                       li $t1, 10  # BEGIN if  # BEGIN If Condition  # Operation: LT64  # Int Literal: 10
                              sw $t1, -16($fp)
                              lw $t3, -12($fp)
                              lw $t4, -16($fp)
                              slt $t2, $t3, $t4
                              sw $t2, -20($fp)
                              lw $t7, -20($fp)
                              beq $zero, $t7, lbl_18  # END If Condition
                              lw $a0, -12($fp)  # BEGIN True Branch  # BEGIN Output
                              addi $v0, $zero, 1
                              syscall  # END Output
                              la $a0, str_1  # BEGIN Output  # String Literal: "\n"
                              addi $v0, $zero, 4
                              syscall  # END Output
                              li $t6, 1  # BEGIN PostInc  # Int Literal: 1
                              sw $t6, -24($fp)
                              lw $t5, -12($fp)
                              add $t5, $t5, $t6
                              sw $t5, -12($fp)  # END PostInc
                              j lbl_17  # END for loop  # END if  # END True Branch
lbl_18:                       sw $zero, -28($fp)  # Initializing b
                              li $t9, 10  # Int Literal: 10
                              sw $t9, -32($fp)
                              lw $t8, -32($fp)
                              sw $t8, -28($fp)  # BEGIN Assigning b  # END Assigning b
lbl_19:                       li $t0, 0  # BEGIN for loop  # BEGIN if  # BEGIN If Condition  # Operation: GT64  # Int Literal: 0
                              sw $t0, -36($fp)
                              lw $t2, -28($fp)
                              lw $t3, -36($fp)
                              slt $t1, $t3, $t2
                              sw $t1, -40($fp)
                              lw $t6, -40($fp)
                              beq $zero, $t6, lbl_20  # END If Condition
                              lw $a0, -28($fp)  # BEGIN True Branch  # BEGIN Output
                              addi $v0, $zero, 1
                              syscall  # END Output
                              la $a0, str_1  # BEGIN Output  # String Literal: "\n"
                              addi $v0, $zero, 4
                              syscall  # END Output
                              li $t5, 1  # BEGIN PostDec  # Int Literal: 1
                              sw $t5, -44($fp)
                              lw $t4, -28($fp)
                              sub $t4, $t4, $t5
                              sw $t4, -28($fp)  # END PostDec
                              j lbl_19  # END for loop  # END if  # END True Branch
lbl_20:                       lw $ra, -8($fp)  # END Function body  # Restore return address
                              lw $fp, -4($fp)  # Restore frame pointer
                              jr $ra  # Return to caller


global_testOperators:         sw $fp, -4($sp)  # Save frame pointer
                              move $fp, $sp  # Set new frame pointer
                              sw $ra, -8($fp)  # Save return address  # BEGIN Function body
                              li $t1, 1  # Operation: AND64  # Int Literal: 1
                              sw $t1, -12($fp)
                              li $t2, 1  # Int Literal: 1
                              sw $t2, -16($fp)
                              lw $t4, -12($fp)
                              lw $t5, -16($fp)
                              and $t3, $t4, $t5
                              sw $t3, -20($fp)
                              lw $t6, -20($fp)  # Setting argument 1
                              sw $t6, -24($fp)
                              addi $sp, $sp, -24  # BEGIN Calling assertBool
                              jal global_assertBool
                              addi $sp, $sp, 24  # END Calling assertBool
                              li $t7, 1  # Operation: OR64  # Int Literal: 1
                              sw $t7, -28($fp)
                              li $t8, 1  # Int Literal: 1
                              sw $t8, -32($fp)
                              lw $t0, -28($fp)
                              lw $t1, -32($fp)
                              or $t9, $t0, $t1
                              sw $t9, -36($fp)
                              lw $t2, -36($fp)  # Setting argument 1
                              sw $t2, -40($fp)
                              addi $sp, $sp, -40  # BEGIN Calling assertBool
                              jal global_assertBool
                              addi $sp, $sp, 40  # END Calling assertBool
                              li $t3, 1  # Operation: AND64  # Int Literal: 1
                              sw $t3, -44($fp)
                              li $t4, 0  # Int Literal: 0
                              sw $t4, -48($fp)
                              lw $t6, -44($fp)
                              lw $t7, -48($fp)
                              and $t5, $t6, $t7
                              sw $t5, -52($fp)
                              lw $t8, -52($fp)  # Setting argument 1
                              sw $t8, -56($fp)
                              addi $sp, $sp, -56  # BEGIN Calling not
                              jal global_not
                              addi $sp, $sp, 56  # END Calling not
                              sw $v0, -60($fp)
                              lw $t9, -60($fp)  # Setting argument 1
                              sw $t9, -64($fp)
                              addi $sp, $sp, -64  # BEGIN Calling assertBool
                              jal global_assertBool
                              addi $sp, $sp, 64  # END Calling assertBool
                              li $t0, 1  # Operation: OR64  # Int Literal: 1
                              sw $t0, -68($fp)
                              li $t1, 0  # Int Literal: 0
                              sw $t1, -72($fp)
                              lw $t3, -68($fp)
                              lw $t4, -72($fp)
                              or $t2, $t3, $t4
                              sw $t2, -76($fp)
                              lw $t5, -76($fp)  # Setting argument 1
                              sw $t5, -80($fp)
                              addi $sp, $sp, -80  # BEGIN Calling assertBool
                              jal global_assertBool
                              addi $sp, $sp, 80  # END Calling assertBool
                              li $t6, 0  # Operation: AND64  # Int Literal: 0
                              sw $t6, -84($fp)
                              li $t7, 1  # Int Literal: 1
                              sw $t7, -88($fp)
                              lw $t9, -84($fp)
                              lw $t0, -88($fp)
                              and $t8, $t9, $t0
                              sw $t8, -92($fp)
                              lw $t1, -92($fp)  # Setting argument 1
                              sw $t1, -96($fp)
                              addi $sp, $sp, -96  # BEGIN Calling not
                              jal global_not
                              addi $sp, $sp, 96  # END Calling not
                              sw $v0, -100($fp)
                              lw $t2, -100($fp)  # Setting argument 1
                              sw $t2, -104($fp)
                              addi $sp, $sp, -104  # BEGIN Calling assertBool
                              jal global_assertBool
                              addi $sp, $sp, 104  # END Calling assertBool
                              li $t3, 0  # Operation: OR64  # Int Literal: 0
                              sw $t3, -108($fp)
                              li $t4, 1  # Int Literal: 1
                              sw $t4, -112($fp)
                              lw $t6, -108($fp)
                              lw $t7, -112($fp)
                              or $t5, $t6, $t7
                              sw $t5, -116($fp)
                              lw $t8, -116($fp)  # Setting argument 1
                              sw $t8, -120($fp)
                              addi $sp, $sp, -120  # BEGIN Calling assertBool
                              jal global_assertBool
                              addi $sp, $sp, 120  # END Calling assertBool
                              li $t9, 0  # Operation: AND64  # Int Literal: 0
                              sw $t9, -124($fp)
                              li $t0, 0  # Int Literal: 0
                              sw $t0, -128($fp)
                              lw $t2, -124($fp)
                              lw $t3, -128($fp)
                              and $t1, $t2, $t3
                              sw $t1, -132($fp)
                              lw $t4, -132($fp)  # Setting argument 1
                              sw $t4, -136($fp)
                              addi $sp, $sp, -136  # BEGIN Calling not
                              jal global_not
                              addi $sp, $sp, 136  # END Calling not
                              sw $v0, -140($fp)
                              lw $t5, -140($fp)  # Setting argument 1
                              sw $t5, -144($fp)
                              addi $sp, $sp, -144  # BEGIN Calling assertBool
                              jal global_assertBool
                              addi $sp, $sp, 144  # END Calling assertBool
                              li $t6, 0  # Operation: OR64  # Int Literal: 0
                              sw $t6, -148($fp)
                              li $t7, 0  # Int Literal: 0
                              sw $t7, -152($fp)
                              lw $t9, -148($fp)
                              lw $t0, -152($fp)
                              or $t8, $t9, $t0
                              sw $t8, -156($fp)
                              lw $t1, -156($fp)  # Setting argument 1
                              sw $t1, -160($fp)
                              addi $sp, $sp, -160  # BEGIN Calling not
                              jal global_not
                              addi $sp, $sp, 160  # END Calling not
                              sw $v0, -164($fp)
                              lw $t2, -164($fp)  # Setting argument 1
                              sw $t2, -168($fp)
                              addi $sp, $sp, -168  # BEGIN Calling assertBool
                              jal global_assertBool
                              addi $sp, $sp, 168  # END Calling assertBool
                              li $t3, 3  # Operation: GT64  # Int Literal: 3
                              sw $t3, -172($fp)
                              li $t4, 2  # Int Literal: 2
                              sw $t4, -176($fp)
                              lw $t6, -172($fp)
                              lw $t7, -176($fp)
                              slt $t5, $t7, $t6
                              sw $t5, -180($fp)
                              lw $t8, -180($fp)  # Setting argument 1
                              sw $t8, -184($fp)
                              addi $sp, $sp, -184  # BEGIN Calling assertBool
                              jal global_assertBool
                              addi $sp, $sp, 184  # END Calling assertBool
                              li $t9, 2  # Operation: GT64  # Int Literal: 2
                              sw $t9, -188($fp)
                              li $t0, 2  # Int Literal: 2
                              sw $t0, -192($fp)
                              lw $t2, -188($fp)
                              lw $t3, -192($fp)
                              slt $t1, $t3, $t2
                              sw $t1, -196($fp)
                              lw $t4, -196($fp)  # Setting argument 1
                              sw $t4, -200($fp)
                              addi $sp, $sp, -200  # BEGIN Calling not
                              jal global_not
                              addi $sp, $sp, 200  # END Calling not
                              sw $v0, -204($fp)
                              lw $t5, -204($fp)  # Setting argument 1
                              sw $t5, -208($fp)
                              addi $sp, $sp, -208  # BEGIN Calling assertBool
                              jal global_assertBool
                              addi $sp, $sp, 208  # END Calling assertBool
                              li $t6, 2  # Operation: GT64  # Int Literal: 2
                              sw $t6, -212($fp)
                              li $t7, 3  # Int Literal: 3
                              sw $t7, -216($fp)
                              lw $t9, -212($fp)
                              lw $t0, -216($fp)
                              slt $t8, $t0, $t9
                              sw $t8, -220($fp)
                              lw $t1, -220($fp)  # Setting argument 1
                              sw $t1, -224($fp)
                              addi $sp, $sp, -224  # BEGIN Calling not
                              jal global_not
                              addi $sp, $sp, 224  # END Calling not
                              sw $v0, -228($fp)
                              lw $t2, -228($fp)  # Setting argument 1
                              sw $t2, -232($fp)
                              addi $sp, $sp, -232  # BEGIN Calling assertBool
                              jal global_assertBool
                              addi $sp, $sp, 232  # END Calling assertBool
                              li $t3, 3  # Operation: LT64  # Int Literal: 3
                              sw $t3, -236($fp)
                              li $t4, 2  # Int Literal: 2
                              sw $t4, -240($fp)
                              lw $t6, -236($fp)
                              lw $t7, -240($fp)
                              slt $t5, $t6, $t7
                              sw $t5, -244($fp)
                              lw $t8, -244($fp)  # Setting argument 1
                              sw $t8, -248($fp)
                              addi $sp, $sp, -248  # BEGIN Calling not
                              jal global_not
                              addi $sp, $sp, 248  # END Calling not
                              sw $v0, -252($fp)
                              lw $t9, -252($fp)  # Setting argument 1
                              sw $t9, -256($fp)
                              addi $sp, $sp, -256  # BEGIN Calling assertBool
                              jal global_assertBool
                              addi $sp, $sp, 256  # END Calling assertBool
                              li $t0, 2  # Operation: LT64  # Int Literal: 2
                              sw $t0, -260($fp)
                              li $t1, 2  # Int Literal: 2
                              sw $t1, -264($fp)
                              lw $t3, -260($fp)
                              lw $t4, -264($fp)
                              slt $t2, $t3, $t4
                              sw $t2, -268($fp)
                              lw $t5, -268($fp)  # Setting argument 1
                              sw $t5, -272($fp)
                              addi $sp, $sp, -272  # BEGIN Calling not
                              jal global_not
                              addi $sp, $sp, 272  # END Calling not
                              sw $v0, -276($fp)
                              lw $t6, -276($fp)  # Setting argument 1
                              sw $t6, -280($fp)
                              addi $sp, $sp, -280  # BEGIN Calling assertBool
                              jal global_assertBool
                              addi $sp, $sp, 280  # END Calling assertBool
                              li $t7, 2  # Operation: LT64  # Int Literal: 2
                              sw $t7, -284($fp)
                              li $t8, 3  # Int Literal: 3
                              sw $t8, -288($fp)
                              lw $t0, -284($fp)
                              lw $t1, -288($fp)
                              slt $t9, $t0, $t1
                              sw $t9, -292($fp)
                              lw $t2, -292($fp)  # Setting argument 1
                              sw $t2, -296($fp)
                              addi $sp, $sp, -296  # BEGIN Calling assertBool
                              jal global_assertBool
                              addi $sp, $sp, 296  # END Calling assertBool
                              li $t3, 3  # Operation: GTE64  # Int Literal: 3
                              sw $t3, -300($fp)
                              li $t4, 2  # Int Literal: 2
                              sw $t4, -304($fp)
                              lw $t6, -300($fp)
                              lw $t7, -304($fp)
                              slt $t5, $t6, $t7
                              xori $t5, $t5, 1
                              sw $t5, -308($fp)
                              lw $t8, -308($fp)  # Setting argument 1
                              sw $t8, -312($fp)
                              addi $sp, $sp, -312  # BEGIN Calling assertBool
                              jal global_assertBool
                              addi $sp, $sp, 312  # END Calling assertBool
                              li $t9, 2  # Operation: GTE64  # Int Literal: 2
                              sw $t9, -316($fp)
                              li $t0, 2  # Int Literal: 2
                              sw $t0, -320($fp)
                              lw $t2, -316($fp)
                              lw $t3, -320($fp)
                              slt $t1, $t2, $t3
                              xori $t1, $t1, 1
                              sw $t1, -324($fp)
                              lw $t4, -324($fp)  # Setting argument 1
                              sw $t4, -328($fp)
                              addi $sp, $sp, -328  # BEGIN Calling assertBool
                              jal global_assertBool
                              addi $sp, $sp, 328  # END Calling assertBool
                              li $t5, 2  # Operation: GTE64  # Int Literal: 2
                              sw $t5, -332($fp)
                              li $t6, 3  # Int Literal: 3
                              sw $t6, -336($fp)
                              lw $t8, -332($fp)
                              lw $t9, -336($fp)
                              slt $t7, $t8, $t9
                              xori $t7, $t7, 1
                              sw $t7, -340($fp)
                              lw $t0, -340($fp)  # Setting argument 1
                              sw $t0, -344($fp)
                              addi $sp, $sp, -344  # BEGIN Calling not
                              jal global_not
                              addi $sp, $sp, 344  # END Calling not
                              sw $v0, -348($fp)
                              lw $t1, -348($fp)  # Setting argument 1
                              sw $t1, -352($fp)
                              addi $sp, $sp, -352  # BEGIN Calling assertBool
                              jal global_assertBool
                              addi $sp, $sp, 352  # END Calling assertBool
                              li $t2, 3  # Operation: LTE64  # Int Literal: 3
                              sw $t2, -356($fp)
                              li $t3, 2  # Int Literal: 2
                              sw $t3, -360($fp)
                              lw $t5, -356($fp)
                              lw $t6, -360($fp)
                              slt $t4, $t6, $t5
                              xori $t4, $t4, 1
                              sw $t4, -364($fp)
                              lw $t7, -364($fp)  # Setting argument 1
                              sw $t7, -368($fp)
                              addi $sp, $sp, -368  # BEGIN Calling not
                              jal global_not
                              addi $sp, $sp, 368  # END Calling not
                              sw $v0, -372($fp)
                              lw $t8, -372($fp)  # Setting argument 1
                              sw $t8, -376($fp)
                              addi $sp, $sp, -376  # BEGIN Calling assertBool
                              jal global_assertBool
                              addi $sp, $sp, 376  # END Calling assertBool
                              li $t9, 2  # Operation: LTE64  # Int Literal: 2
                              sw $t9, -380($fp)
                              li $t0, 2  # Int Literal: 2
                              sw $t0, -384($fp)
                              lw $t2, -380($fp)
                              lw $t3, -384($fp)
                              slt $t1, $t3, $t2
                              xori $t1, $t1, 1
                              sw $t1, -388($fp)
                              lw $t4, -388($fp)  # Setting argument 1
                              sw $t4, -392($fp)
                              addi $sp, $sp, -392  # BEGIN Calling assertBool
                              jal global_assertBool
                              addi $sp, $sp, 392  # END Calling assertBool
                              li $t5, 2  # Operation: LTE64  # Int Literal: 2
                              sw $t5, -396($fp)
                              li $t6, 3  # Int Literal: 3
                              sw $t6, -400($fp)
                              lw $t8, -396($fp)
                              lw $t9, -400($fp)
                              slt $t7, $t9, $t8
                              xori $t7, $t7, 1
                              sw $t7, -404($fp)
                              lw $t0, -404($fp)  # Setting argument 1
                              sw $t0, -408($fp)
                              addi $sp, $sp, -408  # BEGIN Calling assertBool
                              jal global_assertBool
                              addi $sp, $sp, 408  # END Calling assertBool
                              li $t1, 3  # Operation: EQ64  # Int Literal: 3
                              sw $t1, -412($fp)
                              li $t2, 2  # Int Literal: 2
                              sw $t2, -416($fp)
                              lw $t4, -412($fp)
                              lw $t5, -416($fp)
                              xor $t3, $t4, $t5
                              sltiu $t3, $t3, 1
                              sw $t3, -420($fp)
                              lw $t6, -420($fp)  # Setting argument 1
                              sw $t6, -424($fp)
                              addi $sp, $sp, -424  # BEGIN Calling not
                              jal global_not
                              addi $sp, $sp, 424  # END Calling not
                              sw $v0, -428($fp)
                              lw $t7, -428($fp)  # Setting argument 1
                              sw $t7, -432($fp)
                              addi $sp, $sp, -432  # BEGIN Calling assertBool
                              jal global_assertBool
                              addi $sp, $sp, 432  # END Calling assertBool
                              li $t8, 2  # Operation: EQ64  # Int Literal: 2
                              sw $t8, -436($fp)
                              li $t9, 2  # Int Literal: 2
                              sw $t9, -440($fp)
                              lw $t1, -436($fp)
                              lw $t2, -440($fp)
                              xor $t0, $t1, $t2
                              sltiu $t0, $t0, 1
                              sw $t0, -444($fp)
                              lw $t3, -444($fp)  # Setting argument 1
                              sw $t3, -448($fp)
                              addi $sp, $sp, -448  # BEGIN Calling assertBool
                              jal global_assertBool
                              addi $sp, $sp, 448  # END Calling assertBool
                              li $t4, 3  # Operation: NEQ64  # Int Literal: 3
                              sw $t4, -452($fp)
                              li $t5, 2  # Int Literal: 2
                              sw $t5, -456($fp)
                              lw $t7, -452($fp)
                              lw $t8, -456($fp)
                              xor $t6, $t7, $t8
                              slt $t6, $zero, $t6
                              sw $t6, -460($fp)
                              lw $t9, -460($fp)  # Setting argument 1
                              sw $t9, -464($fp)
                              addi $sp, $sp, -464  # BEGIN Calling assertBool
                              jal global_assertBool
                              addi $sp, $sp, 464  # END Calling assertBool
                              li $t0, 2  # Operation: NEQ64  # Int Literal: 2
                              sw $t0, -468($fp)
                              li $t1, 2  # Int Literal: 2
                              sw $t1, -472($fp)
                              lw $t3, -468($fp)
                              lw $t4, -472($fp)
                              xor $t2, $t3, $t4
                              slt $t2, $zero, $t2
                              sw $t2, -476($fp)
                              lw $t5, -476($fp)  # Setting argument 1
                              sw $t5, -480($fp)
                              addi $sp, $sp, -480  # BEGIN Calling not
                              jal global_not
                              addi $sp, $sp, 480  # END Calling not
                              sw $v0, -484($fp)
                              lw $t6, -484($fp)  # Setting argument 1
                              sw $t6, -488($fp)
                              addi $sp, $sp, -488  # BEGIN Calling assertBool
                              jal global_assertBool
                              addi $sp, $sp, 488  # END Calling assertBool
                              li $t7, 2  # Operation: ADD64  # Int Literal: 2
                              sw $t7, -492($fp)
                              li $t8, 3  # Int Literal: 3
                              sw $t8, -496($fp)
                              lw $t0, -492($fp)
                              lw $t1, -496($fp)
                              add $t9, $t0, $t1
                              sw $t9, -500($fp)
                              lw $t3, -500($fp)  # Setting argument 1
                              sw $t3, -508($fp)
                              li $t2, 5  # Int Literal: 5
                              sw $t2, -504($fp)
                              lw $t3, -504($fp)  # Setting argument 2
                              sw $t3, -512($fp)
                              addi $sp, $sp, -512  # BEGIN Calling assert
                              jal global_assert
                              addi $sp, $sp, 512  # END Calling assert
                              li $t4, 2  # Operation: SUB64  # Int Literal: 2
                              sw $t4, -516($fp)
                              li $t5, 3  # Int Literal: 3
                              sw $t5, -520($fp)
                              lw $t7, -516($fp)
                              lw $t8, -520($fp)
                              sub $t6, $t7, $t8
                              sw $t6, -524($fp)
                              lw $t3, -524($fp)  # Setting argument 1
                              sw $t3, -536($fp)
                              li $t9, 1  # Operation: NEG64  # Int Literal: 1
                              sw $t9, -528($fp)
                              lw $t2, -528($fp)
                              sub $t0, $zero, $t2
                              sw $t0, -532($fp)
                              lw $t3, -532($fp)  # Setting argument 2
                              sw $t3, -540($fp)
                              addi $sp, $sp, -540  # BEGIN Calling assert
                              jal global_assert
                              addi $sp, $sp, 540  # END Calling assert
                              li $t4, 2  # Operation: MULT64  # Int Literal: 2
                              sw $t4, -544($fp)
                              li $t5, 3  # Int Literal: 3
                              sw $t5, -548($fp)
                              lw $t7, -544($fp)
                              lw $t8, -548($fp)
                              mult $t7, $t8
                              mflo $t6
                              sw $t6, -552($fp)
                              lw $t0, -552($fp)  # Setting argument 1
                              sw $t0, -560($fp)
                              li $t9, 6  # Int Literal: 6
                              sw $t9, -556($fp)
                              lw $t0, -556($fp)  # Setting argument 2
                              sw $t0, -564($fp)
                              addi $sp, $sp, -564  # BEGIN Calling assert
                              jal global_assert
                              addi $sp, $sp, 564  # END Calling assert
                              li $t1, 9  # Operation: DIV64  # Int Literal: 9
                              sw $t1, -568($fp)
                              li $t2, 4  # Int Literal: 4
                              sw $t2, -572($fp)
                              lw $t4, -568($fp)
                              lw $t5, -572($fp)
                              div $t4, $t5
                              mflo $t3
                              sw $t3, -576($fp)
                              lw $t7, -576($fp)  # Setting argument 1
                              sw $t7, -584($fp)
                              li $t6, 2  # Int Literal: 2
                              sw $t6, -580($fp)
                              lw $t7, -580($fp)  # Setting argument 2
                              sw $t7, -588($fp)
                              addi $sp, $sp, -588  # BEGIN Calling assert
                              jal global_assert
                              addi $sp, $sp, 588  # END Calling assert
lbl_21:                       lw $ra, -8($fp)  # END Function body  # Restore return address
                              lw $fp, -4($fp)  # Restore frame pointer
                              jr $ra  # Return to caller


global_testShadowingHelper:   sw $fp, -4($sp)  # Save frame pointer
                              move $fp, $sp  # Set new frame pointer
                              sw $ra, -8($fp)  # Save return address  # BEGIN Function body
                              li $t2, 4  # Int Literal: 4
                              sw $t2, -12($fp)
                              lw $t1, -12($fp)
                              sw $t1, global_var  # BEGIN Assigning var  # END Assigning var
                              sw $zero, -16($fp)  # Initializing var
                              li $t4, 2  # Int Literal: 2
                              sw $t4, -20($fp)
                              lw $t3, -20($fp)
                              sw $t3, -16($fp)  # BEGIN Assigning var  # END Assigning var
                              lw $v0, -16($fp)  # BEGIN Return
lbl_22:                       lw $ra, -8($fp)  # END Function body  # Restore return address
                              lw $fp, -4($fp)  # Restore frame pointer
                              jr $ra  # Return to caller


global_testShadowing:         sw $fp, -4($sp)  # Save frame pointer
                              move $fp, $sp  # Set new frame pointer
                              sw $ra, -8($fp)  # Save return address  # BEGIN Function body
                              sw $zero, -12($fp)  # Initializing returnValue
                              addi $sp, $sp, -12  # BEGIN Calling testShadowingHelper
                              jal global_testShadowingHelper
                              addi $sp, $sp, 12  # END Calling testShadowingHelper
                              sw $v0, -16($fp)
                              lw $t1, -16($fp)
                              sw $t1, -12($fp)  # BEGIN Assigning returnValue  # END Assigning returnValue
                              lw $t3, global_var  # Setting argument 1
                              sw $t3, -24($fp)
                              li $t2, 4  # Int Literal: 4
                              sw $t2, -20($fp)
                              lw $t3, -20($fp)  # Setting argument 2
                              sw $t3, -28($fp)
                              addi $sp, $sp, -28  # BEGIN Calling assert
                              jal global_assert
                              addi $sp, $sp, 28  # END Calling assert
                              lw $t5, -12($fp)  # Setting argument 1
                              sw $t5, -36($fp)
                              li $t4, 2  # Int Literal: 2
                              sw $t4, -32($fp)
                              lw $t5, -32($fp)  # Setting argument 2
                              sw $t5, -40($fp)
                              addi $sp, $sp, -40  # BEGIN Calling assert
                              jal global_assert
                              addi $sp, $sp, 40  # END Calling assert
lbl_23:                       lw $ra, -8($fp)  # END Function body  # Restore return address
                              lw $fp, -4($fp)  # Restore frame pointer
                              jr $ra  # Return to caller


global_testLongExpression:    sw $fp, -4($sp)  # Save frame pointer
                              move $fp, $sp  # Set new frame pointer
                              sw $ra, -8($fp)  # Save return address  # BEGIN Function body
                              lw $t0, 0($fp)  # Getting argument "isFirstCall"
                              sw $t0, -12($fp)
                              sw $zero, -16($fp)  # Initializing a
                              li $t2, 1  # Int Literal: 1
                              sw $t2, -20($fp)
                              lw $t1, -20($fp)
                              sw $t1, -16($fp)  # BEGIN Assigning a  # END Assigning a
                              sw $zero, -24($fp)  # Initializing b
                              li $t4, 2  # Int Literal: 2
                              sw $t4, -28($fp)
                              lw $t3, -28($fp)
                              sw $t3, -24($fp)  # BEGIN Assigning b  # END Assigning b
                              sw $zero, -32($fp)  # Initializing c
                              li $t6, 3  # Int Literal: 3
                              sw $t6, -36($fp)
                              lw $t5, -36($fp)
                              sw $t5, -32($fp)  # BEGIN Assigning c  # END Assigning c
                              sw $zero, -40($fp)  # Initializing d
                              li $t8, 4  # Int Literal: 4
                              sw $t8, -44($fp)
                              lw $t7, -44($fp)
                              sw $t7, -40($fp)  # BEGIN Assigning d  # END Assigning d
                              sw $zero, -48($fp)  # Initializing e
                              li $t0, 5  # Int Literal: 5
                              sw $t0, -52($fp)
                              lw $t9, -52($fp)
                              sw $t9, -48($fp)  # BEGIN Assigning e  # END Assigning e
                              sw $zero, -56($fp)  # Initializing f
                              li $t2, 6  # Int Literal: 6
                              sw $t2, -60($fp)
                              lw $t1, -60($fp)
                              sw $t1, -56($fp)  # BEGIN Assigning f  # END Assigning f
                              sw $zero, -64($fp)  # Initializing g
                              li $t4, 7  # Int Literal: 7
                              sw $t4, -68($fp)
                              lw $t3, -68($fp)
                              sw $t3, -64($fp)  # BEGIN Assigning g  # END Assigning g
                              lw $t9, -12($fp)  # BEGIN if  # BEGIN If Condition
                              beq $zero, $t9, lbl_25  # END If Condition
                              lw $t7, -16($fp)  # BEGIN True Branch  # Operation: SUB64  # Operation: MULT64  # Operation: ADD64
                              lw $t8, -24($fp)
                              add $t6, $t7, $t8
                              sw $t6, -72($fp)
                              lw $t0, -40($fp)  # Operation: DIV64
                              lw $t1, -32($fp)
                              div $t0, $t1
                              mflo $t9
                              sw $t9, -76($fp)
                              lw $t3, -72($fp)
                              lw $t4, -76($fp)
                              mult $t3, $t4
                              mflo $t2
                              sw $t2, -80($fp)
                              li $t5, 0  # Operation: DIV64  # Int Literal: 0
                              sw $t5, -84($fp)
                              lw $t6, -84($fp)  # Setting argument 1
                              sw $t6, -88($fp)
                              addi $sp, $sp, -88  # BEGIN Calling testLongExpression
                              jal global_testLongExpression
                              addi $sp, $sp, 88  # END Calling testLongExpression
                              sw $v0, -92($fp)
                              lw $t8, -92($fp)
                              lw $t9, -48($fp)
                              div $t8, $t9
                              mflo $t7
                              sw $t7, -96($fp)
                              lw $t1, -80($fp)
                              lw $t2, -96($fp)
                              sub $t0, $t1, $t2
                              sw $t0, -100($fp)
                              lw $t5, -100($fp)
                              sw $t5, -16($fp)  # BEGIN Assigning a  # END Assigning a
                              lw $t7, -16($fp)  # Setting argument 1
                              sw $t7, -112($fp)
                              li $t3, 2  # Operation: NEG64  # Int Literal: 2
                              sw $t3, -104($fp)
                              lw $t6, -104($fp)
                              sub $t4, $zero, $t6
                              sw $t4, -108($fp)
                              lw $t7, -108($fp)  # Setting argument 2
                              sw $t7, -116($fp)
                              addi $sp, $sp, -116  # BEGIN Calling assert
                              jal global_assert
                              addi $sp, $sp, 116  # END True Branch  # END Calling assert
                              j lbl_26
lbl_25:                       lw $t0, -56($fp)  # BEGIN False Branch  # Operation: ADD64  # Operation: ADD64  # Operation: ADD64  # Operation: ADD64  # Operation: ADD64  # Operation: ADD64
                              lw $t1, -64($fp)
                              add $t9, $t0, $t1
                              sw $t9, -120($fp)
                              lw $t3, -48($fp)
                              lw $t4, -120($fp)
                              add $t2, $t3, $t4
                              sw $t2, -124($fp)
                              lw $t6, -40($fp)
                              lw $t7, -124($fp)
                              add $t5, $t6, $t7
                              sw $t5, -128($fp)
                              lw $t9, -32($fp)
                              lw $t0, -128($fp)
                              add $t8, $t9, $t0
                              sw $t8, -132($fp)
                              lw $t2, -24($fp)
                              lw $t3, -132($fp)
                              add $t1, $t2, $t3
                              sw $t1, -136($fp)
                              lw $t5, -16($fp)
                              lw $t6, -136($fp)
                              add $t4, $t5, $t6
                              sw $t4, -140($fp)
                              lw $t8, -140($fp)
                              sw $t8, -16($fp)  # BEGIN Assigning a  # END Assigning a
                              lw $t8, -16($fp)  # Setting argument 1
                              sw $t8, -148($fp)
                              li $t7, 28  # Int Literal: 28
                              sw $t7, -144($fp)
                              lw $t8, -144($fp)  # Setting argument 2
                              sw $t8, -152($fp)
                              addi $sp, $sp, -152  # BEGIN Calling assert
                              jal global_assert
                              addi $sp, $sp, 152  # END Calling assert
                              lw $v0, -16($fp)  # BEGIN Return
lbl_26:                       lw $ra, -8($fp)  # END Function body  # Restore return address
                              lw $fp, -4($fp)  # Restore frame pointer
                              jr $ra  # Return to caller


global_tonOfArguments:        sw $fp, -4($sp)  # Save frame pointer
                              move $fp, $sp  # Set new frame pointer
                              sw $ra, -8($fp)  # Save return address  # BEGIN Function body
                              lw $t0, 24($fp)  # Getting argument "a"
                              sw $t0, -12($fp)
                              lw $t0, 20($fp)  # Getting argument "b"
                              sw $t0, -16($fp)
                              lw $t0, 16($fp)  # Getting argument "c"
                              sw $t0, -20($fp)
                              lw $t0, 12($fp)  # Getting argument "d"
                              sw $t0, -24($fp)
                              lw $t0, 8($fp)  # Getting argument "e"
                              sw $t0, -28($fp)
                              lw $t0, 4($fp)  # Getting argument "f"
                              sw $t0, -32($fp)
                              lw $t0, 0($fp)  # Getting argument "g"
                              sw $t0, -36($fp)
                              lw $a0, -12($fp)  # BEGIN Output
                              addi $v0, $zero, 1
                              syscall  # END Output
                              la $a0, str_1  # BEGIN Output  # String Literal: "\n"
                              addi $v0, $zero, 4
                              syscall  # END Output
                              lw $a0, -16($fp)  # BEGIN Output
                              addi $v0, $zero, 1
                              syscall  # END Output
                              la $a0, str_1  # BEGIN Output  # String Literal: "\n"
                              addi $v0, $zero, 4
                              syscall  # END Output
                              lw $a0, -20($fp)  # BEGIN Output
                              addi $v0, $zero, 1
                              syscall  # END Output
                              la $a0, str_1  # BEGIN Output  # String Literal: "\n"
                              addi $v0, $zero, 4
                              syscall  # END Output
                              lw $a0, -24($fp)  # BEGIN Output
                              addi $v0, $zero, 1
                              syscall  # END Output
                              la $a0, str_1  # BEGIN Output  # String Literal: "\n"
                              addi $v0, $zero, 4
                              syscall  # END Output
                              lw $a0, -28($fp)  # BEGIN Output
                              addi $v0, $zero, 1
                              syscall  # END Output
                              la $a0, str_1  # BEGIN Output  # String Literal: "\n"
                              addi $v0, $zero, 4
                              syscall  # END Output
                              lw $a0, -32($fp)  # BEGIN Output
                              addi $v0, $zero, 1
                              syscall  # END Output
                              la $a0, str_1  # BEGIN Output  # String Literal: "\n"
                              addi $v0, $zero, 4
                              syscall  # END Output
                              lw $a0, -36($fp)  # BEGIN Output
                              addi $v0, $zero, 1
                              syscall  # END Output
                              la $a0, str_1  # BEGIN Output  # String Literal: "\n"
                              addi $v0, $zero, 4
                              syscall  # END Output
lbl_27:                       lw $ra, -8($fp)  # END Function body  # Restore return address
                              lw $fp, -4($fp)  # Restore frame pointer
                              jr $ra  # Return to caller


global_testTonOfArguments:    sw $fp, -4($sp)  # Save frame pointer
                              move $fp, $sp  # Set new frame pointer
                              sw $ra, -8($fp)  # Save return address  # BEGIN Function body
                              li $t1, 11  # Int Literal: 11
                              sw $t1, -12($fp)
                              lw $t8, -12($fp)  # Setting argument 1
                              sw $t8, -40($fp)
                              li $t2, 22  # Int Literal: 22
                              sw $t2, -16($fp)
                              lw $t8, -16($fp)  # Setting argument 2
                              sw $t8, -44($fp)
                              li $t3, 33  # Int Literal: 33
                              sw $t3, -20($fp)
                              lw $t8, -20($fp)  # Setting argument 3
                              sw $t8, -48($fp)
                              li $t4, 44  # Int Literal: 44
                              sw $t4, -24($fp)
                              lw $t8, -24($fp)  # Setting argument 4
                              sw $t8, -52($fp)
                              li $t5, 55  # Int Literal: 55
                              sw $t5, -28($fp)
                              lw $t8, -28($fp)  # Setting argument 5
                              sw $t8, -56($fp)
                              li $t6, 66  # Int Literal: 66
                              sw $t6, -32($fp)
                              lw $t8, -32($fp)  # Setting argument 6
                              sw $t8, -60($fp)
                              li $t7, 77  # Int Literal: 77
                              sw $t7, -36($fp)
                              lw $t8, -36($fp)  # Setting argument 7
                              sw $t8, -64($fp)
                              addi $sp, $sp, -64  # BEGIN Calling tonOfArguments
                              jal global_tonOfArguments
                              addi $sp, $sp, 64  # END Calling tonOfArguments
lbl_28:                       lw $ra, -8($fp)  # END Function body  # Restore return address
                              lw $fp, -4($fp)  # Restore frame pointer
                              jr $ra  # Return to caller


global_main:                  sw $fp, -4($sp)  # Save frame pointer
                              move $fp, $sp  # Set new frame pointer
                              sw $ra, -8($fp)  # Save return address  # BEGIN Function body
                              addi $sp, $sp, -8  # BEGIN Calling printTestHeader
                              jal global_printTestHeader
                              addi $sp, $sp, 8  # END Calling printTestHeader
                              addi $sp, $sp, -8  # BEGIN Calling testOperators
                              jal global_testOperators
                              addi $sp, $sp, 8  # END Calling testOperators
                              addi $sp, $sp, -8  # BEGIN Calling printTestHeader
                              jal global_printTestHeader
                              addi $sp, $sp, 8  # END Calling printTestHeader
                              addi $sp, $sp, -8  # BEGIN Calling testLoops
                              jal global_testLoops
                              addi $sp, $sp, 8  # END Calling testLoops
                              addi $sp, $sp, -8  # BEGIN Calling printTestHeader
                              jal global_printTestHeader
                              addi $sp, $sp, 8  # END Calling printTestHeader
                              addi $sp, $sp, -8  # BEGIN Calling testTonOfArguments
                              jal global_testTonOfArguments
                              addi $sp, $sp, 8  # END Calling testTonOfArguments
                              addi $sp, $sp, -8  # BEGIN Calling printTestHeader
                              jal global_printTestHeader
                              addi $sp, $sp, 8  # END Calling printTestHeader
                              addi $sp, $sp, -8  # BEGIN Calling testShadowing
                              jal global_testShadowing
                              addi $sp, $sp, 8  # END Calling testShadowing
                              addi $sp, $sp, -8  # BEGIN Calling printTestHeader
                              jal global_printTestHeader
                              addi $sp, $sp, 8  # END Calling printTestHeader
                              li $t1, 1  # Int Literal: 1
                              sw $t1, -12($fp)
                              lw $t2, -12($fp)  # Setting argument 1
                              sw $t2, -16($fp)
                              addi $sp, $sp, -16  # BEGIN Calling testLongExpression
                              jal global_testLongExpression
                              addi $sp, $sp, 16  # END Calling testLongExpression
                              addi $sp, $sp, -16  # BEGIN Calling printTestHeader
                              jal global_printTestHeader
                              addi $sp, $sp, 16  # END Calling printTestHeader
                              addi $sp, $sp, -16  # BEGIN Calling testFunctionPointers
                              jal global_testFunctionPointers
                              addi $sp, $sp, 16  # END Calling testFunctionPointers
                              addi $sp, $sp, -16  # BEGIN Calling printSummary
                              jal global_printSummary
                              addi $sp, $sp, 16  # END Calling printSummary
lbl_29:                       lw $ra, -8($fp)  # END Function body  # Restore return address
                              lw $fp, -4($fp)  # Restore frame pointer
                              jr $ra  # Return to caller
