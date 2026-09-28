/*
 * UIL Computer Science 2024
 * Invitational B Packet Solution
 */

import java.io.*;
import java.util.*;

public class Daniella
{

	public static void main(String[]args) throws IOException
	{
		Scanner Sc = new Scanner(new File("daniella.dat"));
		int T = Sc.nextInt();
		for(int i=1; i<=T; i=i+1)
		{
			String St = Sc.next();
			int N = Sc.nextInt();
			//Sc.nextLine();
			int x=0;
			for(x=0; x<St.length()-N;x=x+N)
				System.out.print(St.substring(x,x+N)+"-");
			System.out.println(St.substring(x,St.length()));   
		}

	}      
}



