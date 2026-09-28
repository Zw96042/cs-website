import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;
import java.util.Arrays;

public class Carol
{
	public static boolean isPalindrome(String str, int start, int end)
	{
		str=str.toLowerCase();
		while(start<end)
		{
			if(str.charAt(start)!=str.charAt(end))
				return false;
			start++;
			end--;
		}
		return true;
	}

	public static int numCharactersNeeded(String str)
	{
		String reverse = new StringBuilder(str).reverse().toString();

	    for (int i=str.length()-1; i>=0; i--)
	    {         
	        if (isPalindrome(str, 0, i))
	            return (str.length()-i-1);
	        if (isPalindrome(reverse, 0, i))
	        	return (reverse.length()-i-1);
	    }
	    return 0;
	}

	public static void main(String args[]) throws FileNotFoundException
	{
        Scanner s;
		if(args.length==0)
            s = new Scanner(new File("carol.dat"));
        else
            s = new Scanner(new File(args[0]));

        int numCases=s.nextInt();
        s.nextLine();
        for(int i=0;i<numCases;i++)
        {
        	String line=s.nextLine();
        	System.out.println(numCharactersNeeded(line) + " character(s) need to be added to convert " + line + " into a palindrome.");
        }

        

        s.close();


    }
}