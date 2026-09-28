import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;
public class Eva
{
	public static void printTriangle(int height, int num)
	{
		int astrickCount=1;
		int spaceCount=height-astrickCount;
		System.out.println("Start of Triangle #" + num);
		for(int loopC=1;loopC<=height;loopC++)
		{
			for(int x=0;x<spaceCount;x++)
				System.out.print(" ");
			for(int x=0;x<astrickCount;x++)
				System.out.print("*");
			System.out.println();
			spaceCount--;
			astrickCount+=2;
		}
		System.out.println("End of Triangle #" + num);
	}

	public static void main(String args[]) throws FileNotFoundException
	{
		
		Scanner s;
		if(args.length==0)
           s = new Scanner(new File("eva.dat"));
        else
            s = new Scanner(new File(args[0]));

        int numCases=s.nextInt();
        s.nextLine();
        for(int a=1;a<=numCases;a++)
        {
        	int height=s.nextInt();
        	printTriangle(height,a);
        }
	}
}