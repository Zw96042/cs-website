import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;
import java.util.Arrays;

public class Melissa
{

	public static void main(String args[]) throws FileNotFoundException
	{
        Scanner s;
		if(args.length==0)
            s = new Scanner(new File("melissa.dat"));
        else
            s = new Scanner(new File(args[0]));

        int numCases=s.nextInt();
        s.nextLine();
        for(int i=0;i<numCases;i++)
        {
        	int number=s.nextInt();
        	int numberCopy=number;
        	int product=number;
        	while(number>9)
        	{
        		product=1;
        		while(number>0)
        		{
        			int digit=number%10;
        			number/=10;
        			if(digit==0)
        				continue;
        			product*=digit;
        		}
        		number=product;
        	}
        	System.out.println(numberCopy+" -> " + product);
        }
        s.close();
    }
}