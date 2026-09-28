/*
 * UIL Computer Science 2024
 * Region Packet Solution
 */

import java.io.*;
import java.util.*;

public class Clarabelle
{
	public static void main(String[]args) throws IOException
	{
		Scanner Sf = new Scanner(new File("clarabelle.dat"));
		int T = Sf.nextInt();
		Sf.nextLine();
		for(int i=1; i<=T; i=i+1)
		{
			String Word = Sf.next();
			ArrayList<String>List = new ArrayList<String>();
			for(int x=0; x<=Word.length()-3;x=x+1)
				List.add(Word.substring(x,x+3)); 
			TreeSet<String>Bunch = new TreeSet<String>();
			for(String Bob:List)
			{
				StringBuffer Bertha = new StringBuffer(Bob);
				String Maybe = Bertha.reverse().toString();
				if (Maybe.equals(Bob))
					Bunch.add(Bob);
			}      
			if(Bunch.size()==0)
				System.out.println("NONE");
			else
			{
				String Answer = "";
				for(String Helper:Bunch)
					Answer = Answer + " " + Helper;

				//System.out.println(List);
				//System.out.println(Bunch);
				Answer = Answer.trim();
				System.out.println(Answer);

			}               
		}
	}
}               
