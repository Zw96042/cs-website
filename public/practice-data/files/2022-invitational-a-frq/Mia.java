import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

public class Mia
{
	public static boolean isIdentityMatrix(int matrix[][])
	{
		boolean isIdentity=true;
		for(int a=0;a<matrix.length;a++)
		{
			for(int b=0;b<matrix[a].length;b++)
			{
				if(a==b)
				{
					if(matrix[a][b]!=1)
					{
						isIdentity=false;
						break;
					}
				}
				else
				{
					if(matrix[a][b]!=0)
					{
						isIdentity=false;
						break;
					}
				}
			}
			if(!isIdentity)
				break;
		}

		return isIdentity;
	}

	public static int[][] swap(int matrix[][])
	{
		int size=matrix.length;
		int newMatrix[][]=new int[size][size];

		for(int a=0;a<size;a++)
		{
			for(int b=0;b<size;b++)
			{
				if(matrix[b][a]==1)
					newMatrix[a]=matrix[b];
			}
		}

		return newMatrix;
	}


	public static void main(String args[]) throws FileNotFoundException
	{
		Scanner s;
		if(args.length==0)
           s = new Scanner(new File("mia.dat"));
        else
            s = new Scanner(new File(args[0]));

        int numCases=s.nextInt();
        s.nextLine();
        for(int a=1;a<=numCases;a++)
        {
        	int dimension=s.nextInt();
        	int matrix[][]=new int [dimension][dimension];
        	for(int b=0;b<dimension;b++)
        	{
        		for(int c=0;c<dimension;c++)
        		{
        			matrix[b][c]=s.nextInt();
        		}
        	}
        	System.out.print("Matrix "+a+": ");
			if(isIdentityMatrix(matrix))
				System.out.println("Identity Matrix - No swaps needed");
			else
			{
				int newMatrix[][]=swap(matrix);
				if(isIdentityMatrix(newMatrix))
					System.out.println("Identity Matrix - Swaps needed");
				else
					System.out.println("This is not an Identity Matrix");
			}
		}
		
	}
}