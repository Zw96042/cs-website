// computer.cpp : Defines the entry point for the console application.
//

#include "stdafx.h"
#include <fstream.h>
#include <stdlib.h>
#include <string.h>

#define MAX_LINES 1000
#define MAX_TOKENS 7
#define MAX_TOKEN_LENGTH 10
#define MAX_VARS 100
#define MAX_VAR_LENGTH 10

#define GET_TOKEN \
	infile >> token; \
	strcpy(lines[currentLineNum][currentToken++], token);

#define FIND_VAR \
	varFound = false; \
	for (i = 0; i < numVars; i++) \
	{ \
		if (!strcmp(lines[currentLineNum][currentToken+1], varNames[i])) \
		{ \
			varFound = true; \
			break; \
		} \
	}

int main(int argc, char* argv[])
{
	char varNames[MAX_VARS][MAX_VAR_LENGTH + 1];
	int varValues[MAX_VARS];
	char lines[MAX_LINES][MAX_TOKENS][MAX_TOKEN_LENGTH + 1];
	char token[MAX_TOKEN_LENGTH + 1];
	int currentLineNum = 0;
	int currentToken = 0;
	int numVars = 0;
	int currentDataSet = 1;
	int i = 0;
	bool varFound = false;
	ifstream infile;

	infile.open("computer.dat");
	//Reset variables
	memset(&varValues, 0, MAX_VARS * sizeof(int));
	currentLineNum = 0;
	currentToken = 0;
	numVars = 0;

	//Read in the first line number
	GET_TOKEN;

	while (infile)
	{
		GET_TOKEN;

		while(strcmp(token, "END"))
		{
			if (!strcmp(token, "LOAD") || !strcmp(token, "ADD"))
			{
				GET_TOKEN;
				GET_TOKEN;
			}
			else if (!strcmp(token, "PRINT"))
			{
				GET_TOKEN;
			}
			else if (!strcmp(token, "IF"))
			{
				GET_TOKEN;
				GET_TOKEN;
				GET_TOKEN;
				GET_TOKEN;
				GET_TOKEN;
			}
			currentLineNum++;
			currentToken = 0;
			GET_TOKEN;
			GET_TOKEN;
		}
		//Execute program
		currentLineNum = 0;
		currentToken = 1;
		cout << "START " << currentDataSet << endl;

		while (strcmp(lines[currentLineNum][currentToken], "END"))
		{
			if (!strcmp(lines[currentLineNum][currentToken], "LOAD"))	
			{
				FIND_VAR;

				if (!varFound)
					strcpy(varNames[numVars++], lines[currentLineNum][currentToken+1]);

				varValues[i] = atoi(lines[currentLineNum][currentToken+2]);
				currentLineNum++;
			}
			else if (!strcmp(lines[currentLineNum][currentToken], "ADD"))
			{
				FIND_VAR;

				if (!varFound)
					strcpy(varNames[numVars++], lines[currentLineNum][currentToken+1]);

				varValues[i] += atoi(lines[currentLineNum][currentToken+2]);
				currentLineNum++;
			}
			else if (!strcmp(lines[currentLineNum][currentToken], "PRINT"))
			{
				FIND_VAR;

				cout << varValues[i] << endl;
				currentLineNum++;
			}
			else if (!strcmp(lines[currentLineNum][currentToken], "IF"))
			{
				FIND_VAR;

				if (varValues[i] == atoi(lines[currentLineNum][currentToken+3]))
				{
					for (i = 0; i < MAX_LINES; i++)
						if (!strcmp(lines[currentLineNum][currentToken+5],lines[i][0]))
							break;

					currentLineNum = i;
				}
				else
					currentLineNum++;
			}

			currentToken = 1;
		}
		//Reset variables
		memset(&varValues, 0, MAX_VARS * sizeof(int));
		currentLineNum = 0;
		currentToken = 0;
		numVars = 0;
		currentDataSet++;

		//Read in the first line number
		GET_TOKEN;
		
	}

	infile.close();
	return 0;
}

