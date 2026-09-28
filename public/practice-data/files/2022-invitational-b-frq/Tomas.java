import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;
public class Tomas
{

	public static char translate(String s)
	{
		char firstChar=s.charAt(0);
		int start_ASCII, letter='A';
		int length=s.length();
		if(s.equals("0"))
			return ' ';

		if(firstChar>='2'&&firstChar<='6')
		{
			length%=3;
			if(length==0)
				length+=3;
			start_ASCII='A';
			letter=3*(firstChar-'2')+start_ASCII+(length-1);
		}
		else if(firstChar=='7')
		{
			length%=4;
			if(length==0)
				length+=4;
			start_ASCII='P';
			letter=start_ASCII+(length-1);
		}
		else if(firstChar=='8')
		{
			length%=3;
			if(length==0)
				length+=3;
			start_ASCII='T';
			letter=start_ASCII+(length-1);
		}
		else
		{
			length%=4;
			if(length==0)
				length+=4;
			start_ASCII='W';
			letter=start_ASCII+(length-1);
		}

		return (char)letter;
	}

	public static void main(String args[]) throws FileNotFoundException
	{
		Scanner s;
		if(args.length==0)
           s = new Scanner(new File("tomas.dat"));
        else
            s = new Scanner(new File(args[0]));

        int numCases=s.nextInt();
        s.nextLine();
        s.nextLine();
        for(int i=1;i<=numCases;i++)
        {
        	String line=s.nextLine();
        	String myArray[]=line.split(" ");
			for(int a=0;a<myArray.length;a++)
			{
				System.out.print(translate(myArray[a]));
			}
			System.out.println();
			if(s.hasNextLine())
				s.nextLine();
		}
	}
}