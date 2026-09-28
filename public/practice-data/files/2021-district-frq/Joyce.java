import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;
import java.util.Arrays;

public class Joyce
{

	public static void main(String args[]) throws FileNotFoundException
	{
        Scanner s;
		if(args.length==0)
            s = new Scanner(new File("joyce.dat"));
        else
            s = new Scanner(new File(args[0]));

        int numCases=s.nextInt();
        s.nextLine();
        for(int i=0;i<numCases;i++)
        {
        	String line=s.nextLine();
        	int[] count=new int[26];
        	for(int a=0;a<line.length();a++)
        	{
        		char c=line.charAt(a);
        		if(Character.isLetter(c))
        		{
        			int value=c;
        			if(Character.isLowerCase(c))
        				value-='a'-'A';
        			value-='A';
        			count[value]++;
        		}
        	}
        	
        	String neededLetters="";
        	int sum=0;
        	for(int a=0;a<26;a++)
        	{
        		sum+=count[a];
        		if(count[a]==0)
        		{
        			int tempC='a'+a;
        			neededLetters+=(char)tempC;
        		}
        	}
        	if(neededLetters.length()==0)
        	{
        	    if(sum==26)
        	    	System.out.println("perfect pangram");
        	    else
        	    	System.out.println("pangram");
        	}

        	else
        		System.out.println("missing " + neededLetters);
        }
        s.close();
    }
}