/*
 * UIL Computer Science 2023
 * Invitational A Packet Solution
 */

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

public class Alan
{

	public static void main(String[] args) throws FileNotFoundException
	{
		Scanner s;
        if(args.length==0)
           s = new Scanner(new File("alan.dat"));
        else
            s = new Scanner(new File(args[0]));

		int N = s.nextInt();
		s.nextLine();
		for ( int n = 1; n <= N; n++ )
		{
			int f=s.nextInt();
			double kelvin=5.0/9.0*(f-32)+273.15;
			System.out.printf("%d degrees Fahrenheit is equal to %.2f Kelvin\n",f,kelvin);
		}
		s.close();
	}
}