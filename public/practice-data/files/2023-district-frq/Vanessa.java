/*
 * UIL Computer Science 2023
 * District Packet Solution
 */

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

public class Vanessa
{
    static int count(int coins[], int n, int sum)
    {
        if (sum == 0)
            return 1;
 
        if (sum < 0)
            return 0;
 
        if (n <= 0)
            return 0;
 
        return count(coins, n - 1, sum) + count(coins, n, sum - coins[n - 1]);
    }

	public static void main(String[] args) throws FileNotFoundException
	{
		Scanner s;
        if(args.length==0)
           s = new Scanner(new File("vanessa.dat"));
        else
            s = new Scanner(new File(args[0]));

		int N = s.nextInt();
		s.nextLine();

		for ( int n = 1; n <= N; n++ )
		{
            String line = s.nextLine();
            int sum=s.nextInt();
            s.nextLine();
            s.nextLine();
            
            String[] stringArray = line.split(",");
            int[] coinValues=new int[stringArray.length];
            for(int a=0;a<stringArray.length;a++)
                coinValues[a]=(Integer.parseInt(stringArray[a]));

            System.out.println(count(coinValues, coinValues.length, sum));
		}
	}
}