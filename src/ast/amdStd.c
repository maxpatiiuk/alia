// Standard library for usage in the process of compilation to x64

#include <stdio.h>
#include <stdlib.h>
#include <inttypes.h>
#include <time.h>

int64_t mayhem(){
	static int init = 0;
	if (init == 0){
		srand(time(NULL));
		init = 1;
	}
	return rand();
}

void printBool(int64_t c){
	if (c == 0)
		fprintf(stdout, "false");
	else
		fprintf(stdout, "true");
	fflush(stdout);
}

void printInt(long int num){
	fprintf(stdout, "%ld", num);
	fflush(stdout);
}

void printString(const char * str){
	fprintf(stdout, "%s", str);
	fflush(stdout);
}

int64_t getBool(){
	char c;
	scanf("%c", &c);
	getchar(); // Consume trailing newline
	return c == '0' ? 0 : 1;
}

int64_t getInt(){
	char buffer[32];
	fgets(buffer, 32, stdin);
	long int res = atol(buffer);
	return res;
}
