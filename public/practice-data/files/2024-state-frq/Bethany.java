/*
 * UIL Computer Science 2024
 * State Packet Solution
 */

import java.io.*;
import java.util.*;
import static java.lang.System.*;

public class Bethany
{
	public static int factorCount(int N)
	{
		int C = 0;
		for(int x=1; x<=N; x++)
			if(N%x==0)
				C++;
		return C;
	} 

	public static void main(String[]args) throws IOException
	{
		Scanner Sf = new Scanner(new File("bethany.dat"));
		int T = Sf.nextInt();
		for(int i=1; i<=T; i=i+1)
		{
			int A = Sf.nextInt();
			int B = Sf.nextInt();
			int x = 1;
			int Count = 0;
			while (Count<A)
			{
				if(factorCount(x)==B)
				{
					out.print(x+" ");
					Count++;
				}
				x++;  
			}
			out.println();      
		}
	}
}               
