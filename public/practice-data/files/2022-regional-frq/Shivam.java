import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;
import java.util.*;

class Shivam
{
	public static final double EPSILON = 0.00000001;

	public static int getCoefficient(String s, int start, int stop)
	{
			String coefficeintString=s.substring(start,stop);
			if(coefficeintString.length()==0)
				return 1;
			else if(coefficeintString.equals("-"))
				return -1;
			else if(coefficeintString.equals("+"))
				return 1;
			else
				return Integer.parseInt(coefficeintString);
	}

	public static int[] parse(String s)
	{
		int[] abc={0,0,0};
		int indexOfEqualSign=s.indexOf('=');//function must have
		int indexOfXSquared=s.indexOf("x^2");//function must have
		int indexOfX=s.indexOf('x',indexOfXSquared+3);//if -1, don't have b coef

		abc[0]=getCoefficient(s,indexOfEqualSign+1,indexOfXSquared);//must have and x^2

		if(indexOfXSquared==s.length()-3)//a is present only
		{
			//do nothing
		}
		else if(indexOfX==s.length()-1)//a and b are present, no c
		{
			abc[1]=getCoefficient(s,indexOfXSquared+3,s.length()-1);
		}
		else if(indexOfX==-1)//a and c are present, no b
		{
			abc[2]=getCoefficient(s,indexOfXSquared+3,s.length());
		}
		else//a, b, and c are all present
		{
			abc[1]=getCoefficient(s,indexOfXSquared+3,indexOfX);
			abc[2]=getCoefficient(s,indexOfX+1,s.length());
		}

		return abc;
	}

	public static int numRealRoots(int[] abc)
	{
		int discriminant=abc[1]*abc[1]-4*abc[0]*abc[2];
		if(discriminant>0)
			return 2;
		else if(discriminant==0)
			return 1;

		return 0;
	}

	public static void printRoots(int[] abc)
	{
		int numRoots=numRealRoots(abc);
		if(numRoots==2)
		{
			double[] roots=new double[2];
			roots[0]=(-abc[1]+Math.sqrt(abc[1]*abc[1]-4*abc[0]*abc[2]))/(2*abc[0]);
			roots[1]=(-abc[1]-Math.sqrt(abc[1]*abc[1]-4*abc[0]*abc[2]))/(2*abc[0]);
			if(Math.abs(roots[0]-0)<EPSILON)
				roots[0]=0.0;
			if(Math.abs(roots[1]-0)<EPSILON)
				roots[1]=0.0;
			Arrays.sort(roots);//make sure to print left root, then right root
			System.out.printf("There are two real roots at (%.2f,0.00) and (%.2f,0.00).\n",roots[0],roots[1]);//round to two decimal places
		}
		else if(numRoots==1)
		{
			double root=-abc[1]/(2*abc[0]);
			System.out.printf("There is one real root at (%.2f,0.00).\n",root);
		}
		else
		{
			System.out.println("There are no real roots to the function.");
		}
	}

	public static void main(String[] args) throws FileNotFoundException
    {
    	
        Scanner s;
        if(args.length==0)
           s = new Scanner(new File("shivam.dat"));
        else
            s = new Scanner(new File(args[0]));

        int numCases=s.nextInt();
        s.nextLine();
        for(int a=1;a<=numCases;a++)
        {
        	int[] abc=parse(s.nextLine());
        	System.out.print("Function "+a+": ");
        	printRoots(abc);
        }
    }
}