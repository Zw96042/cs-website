/*
 * UIL Computer Science 2024
 * Invitational A Packet Solution
 */

import java.io.*;
import java.util.*;

public class Andrew
{
	public static void main(String[]args) throws IOException
	{
		Scanner Sc = new Scanner(new File("andrew.dat"));
		int N = Sc.nextInt();
		Sc.nextLine();
		for(int i=1; i<=N; i++)
		{
			String Answer = "";
			int Number = Sc.nextInt();
			if (Number%1==0)
				Answer+="ONE ";
			if (Number%2==0)
				Answer+="TWO ";
			if (Number%3==0)
				Answer+="THREE "; 
			if (Number%4==0)
				Answer+="FOUR ";
			if (Number%5==0)
				Answer+="FIVE ";
			if (Number%6==0)
				Answer+="SIX ";
			if (Number%7==0)
				Answer+="SEVEN ";
			if (Number%8==0)
				Answer+="EIGHT "; 
			if (Number%9==0)
				Answer+="NINE ";
			Answer = Answer.trim();
			System.out.println(Answer);                          
		}               
	}
}