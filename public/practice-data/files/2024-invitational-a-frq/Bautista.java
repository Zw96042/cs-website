/*
 * UIL Computer Science 2024
 * Invitational A Packet Solution
 */

import java.io.*;
import java.util.*;

public class Bautista
{
	public static void main(String[]args) throws IOException
	{
		Scanner Sc = new Scanner(new File("bautista.dat"));
		int N = Sc.nextInt();
		Sc.nextLine();
		for(int i=1; i<=N; i++)
		{
			String Word = Sc.next();
			String Answer = "";
			int x=0;
			for(x=0; x<=Word.length()-1;x=x+1) 
			{
				if ("aeiou".indexOf(Word.substring(x,x+1))>=0)
					Answer+="OUCH!!!";
				else
					Answer+=Word.substring(x,x+1);
			}        
			Answer = Answer.trim();
			System.out.println(Answer);                             

		}               
	}
}