/*
 * UIL Computer Science 2024
 * Invitational B Packet Solution
 */

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

public class Hiromi
{
	public static int sumArray(int[] array)
	{
		int sum=0;
		for(int a=0;a<array.length;a++)
			sum+=array[a];

		return sum;
	}

	public static void main(String args[]) throws FileNotFoundException
	{
		Scanner s;
        if(args.length==0)
           s = new Scanner(new File("hiromi.dat"));
        else
            s = new Scanner(new File(args[0]));

		int N = s.nextInt();
		s.nextLine();

		for ( int n = 1; n <= N; n++ )
		{
			s.nextLine();
			int[][] board=new int[9][9];
			for(int a=0;a<board.length;a++)
			{
				for(int b=0;b<board[a].length;b++)
				{
					board[a][b]=s.nextInt();
				}
			}
			s.nextLine();
			boolean isGood=true;

			for(int a=0;a<board.length;a++)
			{
				int[] row=new int[9];
				int[] col=new int[9];
				for(int b=0;b<board[a].length;b++)
				{
					row[board[a][b]-1]=1;
					col[board[b][a]-1]=1;
				}
				
				if(sumArray(row)!=9)
				{
					isGood=false;
				}
				if(sumArray(col)!=9)
				{
					isGood=false;
				}
			}
			
			for(int x = 0; x < 3; x++)
			{
				for(int y = 0; y < 3; y++)
				{
					int[] region=new int[9];
					for(int i = 0; i < 3; i++)
					{
						for(int j = 0; j < 3; j++)
						{
							//System.out.println((x*3+i)+","+(y*3+j));
							region[board[x*3+i][y*3+j]-1]=1;
						}
					}
					if(sumArray(region)!=9)
					{
						isGood=false;
					}
				}
			}
			
			System.out.println("Puzzle #" + n + ": " + isGood);
		}
	}
}