// picture.cpp : Defines the entry point for the console application.
//

#include "stdafx.h"
#include <fstream.h>

int main(int argc, char* argv[])
{
	char token[10];
	int totalRows, totalCols;
	int pixel, run;
	int numOnRun, numOnRow, currentRow;
	ifstream infile;

	infile.open("picture.dat");

	infile >> token >> totalCols >> totalRows;

	while (infile)
	{
		currentRow = 0;
		numOnRow = 0;
		numOnRun = 0;
		infile >> pixel >> run;
		while (currentRow < totalRows)
		{
			while (numOnRow < totalCols && numOnRun < run)
			{
				cout << pixel;
				numOnRow++;
				numOnRun++;
			}
			if (numOnRow >= totalCols)
			{
				cout << endl;
				numOnRow = 0;
				currentRow++;
			}
			if (numOnRun >= run)
			{
				numOnRun = 0;
				if (currentRow < totalRows)
					infile >> pixel >> run;
			}
		}
		infile >> token >> totalCols >> totalRows;
	}

	infile.close();
	return 0;
}

