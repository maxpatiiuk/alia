LIBLINUX := -dynamic-linker /lib64/ld-linux-x86-64.so.2
OUTFILE := outfile.s
PROG := dev.prog

CLANG := /home/a807d786/llvm_dist/bin/clang
LLC := /home/a807d786/llvm_dist/bin/llc

all:
	npm install

test:
	npm test

link:
	gcc -o ./amdStd.o -c ./src/instructions/definitions/amd/amdStd.c
	as -o asm.a $(OUTFILE)
	ld $(LIBLINUX) \
		/usr/lib/x86_64-linux-gnu/crt1.o \
		/usr/lib/x86_64-linux-gnu/crti.o \
		-lc \
		asm.a \
		./amdStd.o \
		/usr/lib/x86_64-linux-gnu/crtn.o \
		-o $(PROG)
	./$(PROG)

llvm:
	$(CLANG) test.c -S -emit-llvm -o test.ll
	$(LLC) test.ll
	$(CLANG) test.s
	./a.out