
import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;import java.lang.Math;
public class Michaela
{

	public static String convertChar(char c)
	{
		String binary=Integer.toBinaryString((int)c);
		String finalString=binary.replaceAll("0",".");
		finalString=finalString.replaceAll("1","-");
		return finalString;
	}

	public static String convertFullString(String s)
	{
		String returnS="";
		for(int a=0;a<s.length();a++)
		{
			if(a == 0)
			{
				returnS+=convertChar(s.charAt(a));
			}
			else
			{
				returnS+=(" "+convertChar(s.charAt(a)));
			}
		}
		return returnS;
	}


	public static void main(String args[]) throws FileNotFoundException
	{

		Scanner s;
        if(args.length==0)
           s = new Scanner(new File("michaela.dat"));
        else
            s = new Scanner(new File(args[0]));

        int numCases=s.nextInt();
        s.nextLine();
        for(int a=1;a<=numCases;a++)
        {
        	String line=s.nextLine();
        	line=line.toUpperCase();
        	System.out.println("Message #"+ a+ ": "+convertFullString(line));
        }
	}
}