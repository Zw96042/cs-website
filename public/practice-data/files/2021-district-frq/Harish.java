import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;
import java.util.Arrays;

public class Harish
{

	public static boolean isValid(int row, int col)
	{
		if((row>=0&&row<5)&&(col>=0&&col<5))
			return true;

		return false;
	}
	public static void main(String args[]) throws FileNotFoundException
	{
        Scanner s;
		if(args.length==0)
            s = new Scanner(new File("harish.dat"));
        else
            s = new Scanner(new File(args[0]));

        int numCases=s.nextInt();
        s.nextLine();
        for(int i=0;i<numCases;i++)
        {
        	char[][] input=new char[5][5];
        	int archerCount=0;
        	for(int a=0;a<5;a++)
        	{
        		String line=s.nextLine();
        		for(int b=0;b<5;b++)
        		{
					input[a][b]=line.charAt(b);
					if(input[a][b]=='a')
						archerCount++;
        		}
        	}
        	s.nextLine();

        	if(archerCount!=9)
        	{
        		System.out.println("invalid");
        		continue;
        	}
        	boolean valid=true;
        	for(int a=0;a<5;a++)
        	{
        		for(int b=0;b<5;b++)
        		{
        			if(input[a][b]=='a')
        			{
        				int row,col;

        				//case 1
        				row=a+2;
        				col=b+2;
        				if(isValid(row,col)&&input[row][col]=='a')
        					valid=false;

        				//case 2
        				row=a+2;
        				col=b-2;
        				if(isValid(row,col)&&input[row][col]=='a')
        					valid=false;

        			

        			}
        		}
        	}
        	if(valid)
        		System.out.println("valid");
        	else
        		System.out.println("invalid");
        }
        s.close();
	}
}