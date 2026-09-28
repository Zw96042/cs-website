import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;
public class Lavanya
{
	public static void printPrimeFactorization(int n)
	{
		System.out.print(n + " = ");
		int count=0;
		while(n!=1)
		{
			for(int d=2;d<=n;d++)
			{
				if(n%d==0)
				{
					count++;
					if(count==1)
						System.out.print(d);
					else
						System.out.print(" * "+d);
					n/=d;
					break;
				}
			}
		}
		System.out.println();
	}

	public static void main(String args[]) throws FileNotFoundException
	{
		Scanner s;
        if(args.length==0)
           s = new Scanner(new File("lavanya.dat"));
        else
            s = new Scanner(new File(args[0]));

        int numCases=s.nextInt();
        s.nextLine();
        for(int a=1;a<=numCases;a++)
        {
        	int i=s.nextInt();
        	printPrimeFactorization(i);
        }
	}
}

//For a given integer n > 1, the smallest integer d > 1 that divides n is a prime factor. We can find the
//prime factorization of n if we find d and then replace n by the quotient of n divided by d, repeating this
//until n becomes 1.