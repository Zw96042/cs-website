// fraction.cpp : Defines the entry point for the console application.
//

#include "stdafx.h"
#include <fstream.h>

int main(int argc, char* argv[])
{
	int numerator, denominator, i, GPCD;
	bool reducing;
	ifstream infile;

	infile.open("fraction.dat");

	//Read in the first fraction
	infile >> numerator >> denominator;

	while (infile)
	{
		if (numerator < 1 || numerator > 10000)
		{
			cout << "INVALID DATA SET; numerator = " << numerator << endl;
			return 1;
		}
		if (denominator < 1 || denominator > 10000)
		{
			cout << "INVALID DATA SET; denominator = " << denominator << endl;
			return 1;
		}
		if (numerator == denominator)
		{
			//Well, that was easy, the fraction reduces to 1 1
			cout << "1 1" << endl;
		}
		else
		{
			reducing = true;

			while (reducing)
			{
				reducing = false;
				//We'll keep looking for common denominators until we
				//reach half the larger of the numerator and denominator
				//(greatest possible common denominator)
				GPCD = (numerator > denominator) ? numerator / 2 : denominator / 2;
				for (i = 2; i <= GPCD && !reducing; i++)
				{
					if (numerator % i == 0 && denominator % i == 0)
					{
						//We found a common denominator.  Reduce the
						//numerator and denominator and try to reduce
						//some more.
						numerator /= i;
						denominator /= i;
						reducing = true;
					}
				}
			}

			//Display the reduced fraction
			cout << numerator << " " << denominator << endl;
		}
		//Read in the next fraction
		infile >> numerator >> denominator;
	}

	infile.close();
	return 0;
}

