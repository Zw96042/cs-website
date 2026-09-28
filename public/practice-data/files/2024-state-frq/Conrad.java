/*
 * UIL Computer Science 2024
 * State Packet Solution
 */

import java.io.*;
import java.util.*;
import static java.lang.System.*;

public class Conrad
{
	public static int letterDiff(char One, char Two)
	{
		return Math.abs(One-Two);
	} 

	public static void main(String[]args) throws IOException
	{
		Scanner Sf = new Scanner(new File("conrad.dat"));
		int T = Sf.nextInt();
		Sf.nextLine();

		for(int i=1; i<=T; i=i+1)
		{
			String Word = Sf.nextLine();
			int Count = 0;
			int D = 0;
			if (Word.length()>1)
				D=letterDiff(Word.charAt(0),Word.charAt(1));
			for(int x=0;x<Word.length()-1;x++)
				if(letterDiff(Word.charAt(x),Word.charAt(x+1))==D)
					Count++;
			if(Word.length()==1 || Count==Word.length()-1)
				out.println(Word); 
			else
				out.println("BAD!!!");     
		}
		out.println();      
	}
}
