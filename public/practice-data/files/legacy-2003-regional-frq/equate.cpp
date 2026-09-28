// equate.cpp : Defines the entry point for the console application.
//

#include "stdafx.h"
#include "iostream.h"
#include "string.h"
#include "stdlib.h"

#define MAX_EXPR_LEN 1000
#define MAX_TOKEN_LEN 4
#define MAX_TOKENS 200

int evaluate(char expr[]);

int main(int argc, char* argv[])
{
	char token[MAX_EXPR_LEN+1];
	char expression[MAX_EXPR_LEN+1];

	char *equalIndex;

	//Get expression
	cin.getline(token, MAX_EXPR_LEN);

	while (cin)
	{
		equalIndex = strchr( token, '=' );
		
		strcpy(expression, equalIndex+2);

		cout << "x = " << evaluate(expression) << endl;

		//Get expression
		cin.getline(token, MAX_EXPR_LEN);
	}


	return 0;
}

int evaluate(char expr[])
{
	char newExpr[MAX_EXPR_LEN];
	char tokens[MAX_TOKENS][MAX_TOKEN_LEN+1];
	char *token;

	int numTokens = 0, i;

	int firstMultIndex = -1, firstAddIndex = -1, firstSubIndex = -1;

	//Copy expression since strtok will modify it
	strcpy(newExpr, expr);

	//Break expression up into tokens; record first instance of '*'
	//'+' and '-'
	token = strtok(newExpr, " ");
	while (token != NULL)
	{
		strcpy(tokens[numTokens], token);

		if (!strcmp(token, "*"))
		{
			if (firstMultIndex == -1)
				firstMultIndex = numTokens;
		}
		else if (!strcmp(token, "+"))
		{
			if (firstAddIndex == -1 && firstSubIndex == -1)
				firstAddIndex = numTokens;
		}
		else if (!strcmp(token, "-"))
		{
			if (firstAddIndex == -1 && firstSubIndex == -1)
				firstSubIndex = numTokens;
		}
		numTokens++;
		token = strtok(NULL, " ");
	}

	if (firstMultIndex != -1)
	{
		itoa(atoi(tokens[firstMultIndex-1]) * 
			 atoi(tokens[firstMultIndex+1]),
			 tokens[firstMultIndex-1], 10);
		strcpy(tokens[firstMultIndex], "\0");
		strcpy(tokens[firstMultIndex+1], "\0");
	}
	else if (firstAddIndex != -1)
	{
		itoa(atoi(tokens[firstAddIndex-1]) +
			 atoi(tokens[firstAddIndex+1]),
			 tokens[firstAddIndex-1], 10);
		strcpy(tokens[firstAddIndex], "\0");
		strcpy(tokens[firstAddIndex+1], "\0");
	}
	else if (firstSubIndex != -1)
	{
		itoa(atoi(tokens[firstSubIndex-1]) - 
			 atoi(tokens[firstSubIndex+1]),
			 tokens[firstSubIndex-1], 10);
		strcpy(tokens[firstSubIndex], "\0");
		strcpy(tokens[firstSubIndex+1], "\0");
	}
	else //We have just a number left
		return atoi(expr);

	//Rebuild expression from tokens with substituted expression
	strcpy(expr, tokens[0]);
	for (i = 1; i < numTokens; i++)
	{
		if (strcmp(tokens[i], "\0"))
		{
			strcat(expr, " ");
			strcat(expr, tokens[i]);
		}
	}
	
	return evaluate(expr);
}