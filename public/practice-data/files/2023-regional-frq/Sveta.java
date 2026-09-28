/*
 * UIL Computer Science 2023
 * Region Packet Solution
 */

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

public class Sveta
{

	public static boolean containsInt(int[] myArray, int i)
	{
		for(int a=0;a<myArray.length;a++)
			if(myArray[a]==i)
				return true;

		return false;
	}

	public static int[] parseIndex(String s)
	{
		String setOnly=s.substring(s.indexOf(':')+2);
		String[] indexesString=setOnly.split(",");
		int[] indexesInt=new int[indexesString.length];
		for(int a=0;a<indexesString.length;a++)
			indexesInt[a]=Integer.parseInt(indexesString[a]);

		return indexesInt;
	}

	public static void main(String args[]) throws FileNotFoundException
	{
		Scanner s;
        if(args.length==0)
           s = new Scanner(new File("sveta.dat"));
        else
            s = new Scanner(new File(args[0]));

		int N = s.nextInt();
		s.nextLine();

		for ( int n = 1; n <= N; n++ )
		{
			String numBitsString=s.nextLine();
			int start=Integer.parseInt(numBitsString.substring(numBitsString.indexOf('=')+1))-1;
			String set1=s.nextLine();
			String set0=s.nextLine();
			String invert=s.nextLine();
			String dashes=s.nextLine();

			// bitwise or
			if(set1.indexOf("n/a")==-1&&set0.indexOf("n/a")!=-1&&invert.indexOf("n/a")!=-1)
			{
				int[] index=parseIndex(set1);

				int mask=0;
				for(int a=start;a>=0;a--)
				{
					if(containsInt(index,a))
						mask=(mask<<1)|1;
					else
						mask=(mask<<1)|0;
				}
				System.out.println("opnd | "+Integer.toHexString(mask).toUpperCase());
			}
			else if(set1.indexOf("n/a")!=-1&&set0.indexOf("n/a")==-1&&invert.indexOf("n/a")!=-1)
			{
				int[] index=parseIndex(set0);

				int mask=0;
				for(int a=start;a>=0;a--)
				{
					if(containsInt(index,a))
						mask=(mask<<1)|0;
					else
						mask=(mask<<1)|1;
				}
				System.out.println("opnd & "+Integer.toHexString(mask).toUpperCase());
			}
			else if((set1.indexOf("n/a")!=-1&&set0.indexOf("n/a")!=-1&&invert.indexOf("n/a")==-1))
			{
				int[] index=parseIndex(invert);

				int mask=0;
				for(int a=start;a>=0;a--)
				{
					if(containsInt(index,a))
						mask=(mask<<1)|1;
					else
						mask=(mask<<1)|0;
				}
				System.out.println("opnd ^ "+Integer.toHexString(mask).toUpperCase());
			}
			else
				System.out.println("This can not be done with a single bitwise operator.");

		}
	}
}