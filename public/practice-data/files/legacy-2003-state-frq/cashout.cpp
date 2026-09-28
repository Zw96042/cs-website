// change2.cpp : Defines the entry point for the console application.
//


#include "stdafx.h"
#include <fstream.h>

bool Perm(int bills[], int k, int m, int amount2);
void Swap(int& a, int& b);

int main(int argc, char* argv[])
{
	int amount1, amount2, currentAmount, amountLeft, amountToAdd;
	int numBills;
	int bills[100];
	bool change;

	ifstream infile;

	infile.open("cashout.dat");

	infile >> amount1;
	infile >> amount2;

	while (infile)
	{
		numBills = 0;
		currentAmount = 0;

		//First, build the case of change for the first amount
		//with the fewest bills possible
		while (currentAmount != amount1)
		{
			amountLeft = amount1 - currentAmount;
			if (amountLeft >= 20)
				amountToAdd = 20;
			else if (amountLeft >= 10)
				amountToAdd = 10;
			else if (amountLeft >= 5)
				amountToAdd = 5;
			else
				amountToAdd = 1;

			bills[numBills++] = amountToAdd;
			currentAmount += amountToAdd;
		}
		
		//Examine all the permutations of the fewest-bills set
		//to see if any subsets add up to the second amount
		change = Perm(bills, 0, numBills - 1, amount2);

		if (change)
			cout << "I'VE GOT CHANGE" << endl;
		else
			cout << "I MIGHT NEED CHANGE" << endl;

		infile >> amount1;
		infile >> amount2;
	}

	infile.close();
	
	return 0;
}

bool Perm(int bills[], int k, int m, int amount2)
{
	bool change = false;
	int i;
	int currentAmount = 0;
	if (k == m)
	{
		for (i = 0; i <= m; i++)
		{
			currentAmount += bills[i];
			if (currentAmount == amount2)
				return true;
		}
	}
	else
	{
		for (i = k; i <= m; i++)
		{
			Swap(bills[k], bills[i]);
			change = Perm(bills, k+1, m, amount2);
			if (change)
				return change;
			Swap(bills[k], bills[i]);
		}
	}
	return change;
}

void Swap(int& a, int& b)
{
	int temp = a; a = b; b = temp;
}