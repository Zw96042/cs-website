import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

public class Harold
{
	public static void main(String args[]) throws FileNotFoundException
	{
		Scanner s;
		if(args.length==0)
           s = new Scanner(new File("harold.dat"));
        else
            s = new Scanner(new File(args[0]));

        int numCases=s.nextInt();
        s.nextLine();
        for(int a=1;a<=numCases;a++)
        {
			int inputOrig=s.nextInt();
			
			int inputTemp=inputOrig;
			int powerCount=0;
			while(inputTemp>0)
			{
				powerCount++;
				inputTemp/=10;
			}

			//The above for loop goes one too many times since it has to go all the way down to zero
			//therefore, need to decrement power by 1
			powerCount--;

			double numToPrint=inputOrig/Math.pow(10,powerCount);
			if(numToPrint==Math.floor(numToPrint))
				System.out.println(inputOrig+"=" + (int)numToPrint+"*10^"+powerCount);
			else
				System.out.println(inputOrig+"=" + numToPrint+"*10^"+powerCount);
		}
	}
}