/*
 * UIL Computer Science 2024
 * Region Packet Solution
 */

import java.io.*;
import java.util.*;

public class Bob
{
	public static void main(String[]args) throws IOException
	{
		Scanner Sf = new Scanner(new File("bob.dat"));
		int T = Sf.nextInt();
		for(int i=1; i<=T; i=i+1)
		{
			int A = Sf.nextInt();
			int B = Sf.nextInt();
			int C = Sf.nextInt();
			int D = Sf.nextInt();
			int E = Sf.nextInt();
			int[]List = {A,B,C,D,E};
			Arrays.sort(List);
			A = List[4];
			B = List[3];
			C = List[2];
			D = List[1];
			E = List[0];            
			System.out.println(A*B+C+D*E);
		}
	}
}               
