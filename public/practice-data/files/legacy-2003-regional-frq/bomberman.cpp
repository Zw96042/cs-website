// bomber.cpp : Defines the entry point for the console application.
//

#include "stdafx.h"
#include "iostream.h"
#include "string.h"
#include "stdlib.h"

#define MAX_ROWS 10
#define MAX_COLS 10
#define MAX_BOMBS 5

#define MAX_TOKEN_LEN 20

char bombDelims[] = "(,";

int main(int argc, char* argv[])
{
	char token[MAX_TOKEN_LEN];
	char *strToken;
	bool safe[MAX_ROWS][MAX_COLS];

	int numRows, numCols, numBombs;
	int row, col, i, j;
	int safeSpaces;

	cin >> token;

	while (cin)
	{
		if (strcmp(token, "START") != 0)
		{
			cout << "Error reading data set, read " << token << " when expecting START" << endl;
			return -1;
		}

		cin >> numRows >> numCols >> numBombs;

		for(i = 0; i < numRows; i++)
			for (j = 0; j < numCols; j++)
				safe[i][j] = true;

		for (i = 0; i < numBombs; i++)
		{
			cin >> token;
			strToken = strtok( token, bombDelims );		
			row = atoi(strToken);
			strToken = strtok( NULL, bombDelims );
			col = atoi(strToken);
			
			if (row < 0 || row > numRows || col < 0 || col > numCols)
			{
				cout << "Invalid bomb position: (" << row << "," << col << ")" << endl;
				return -1;
			}

			safe[row][col] = false;

			if (row > 0)
				safe[row-1][col] = false;
			if (row < numRows - 1)
				safe[row+1][col] = false;
			if (col > 0)
				safe[row][col-1] = false;
			if (col < numCols - 1)
				safe[row][col+1] = false;
		}

		cin >> token;

		if (strcmp(token, "END") != 0)
		{
			cout << "Error reading data set, read " << token << " when expecting END" << endl;
			return -1;
		}

		safeSpaces = 0;

		for (i = 0; i < numRows; i++)
		{
			for (j = 0; j < numCols; j++)
			{
				if (safe[i][j])
				{
					if (safeSpaces++)
						cout << " ";
					cout << "(" << i << "," << j << ")";
				}
			}
		}

		if (!safeSpaces)
			cout << "BOMBERMAN'S TOAST!";

		cout << endl;

		cin >> token;
	}

	return 0;
}

