/*
 * UIL Computer Science 2023
 * Invitational A Packet Solution
 */

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

public class Himanshu
{
	public static class Coordinate
	{
		int x, y;

		public Coordinate(int newX, int newY)
		{
			x=newX;
			y=newY;
		}

		public void updatePosition(int newX, int newY)
		{
			x=newX;
			y=newY;
		}

		public void updatePosition(Coordinate c)
		{
			updatePosition(c.x, c.y);
		}

		public boolean valid()
		{
			if(x>=0&&y>=0)
				return true;

			return false;
		}
	}

	public static Coordinate getCoordinate(int[][] intBoard, int index)
	{
		for(int x=0;x<intBoard.length;x++)
		{
			for(int y=0;y<intBoard[x].length;y++)
			{
				if(intBoard[x][y]==index)
					return new Coordinate(x,y);
			}
		}
		return new Coordinate(-1,-1);
	}

	public static int[][] makeBoardIndex(int dimension)
	{
		int[][] boardInt=new int[dimension][dimension];

		for(int x=0;x<dimension;x++)
		{
			for(int y=0;y<dimension;y++)
			{
				if(dimension%2==1)
				{
					if(x%2==0)
						boardInt[x][y]=((dimension-x-1)*dimension+y);
					else
						boardInt[x][y]=((dimension-x)*dimension-y-1);
				}
				else
				{
					if(x%2==1)
						boardInt[x][y]=((dimension-x-1)*dimension+y);
					else
						boardInt[x][y]=((dimension-x)*dimension-y-1);
				}
			}
		}

		return boardInt;
	}

	public static int[] parseMoves(String s)
	{
		String[] splitArray = s.split(",");
        int[] array = new int[splitArray.length];
 
        for (int i = 0; i < splitArray.length; i++)
        {
            array[i] = Integer.parseInt(splitArray[i]);
        }

        return array;
	}

	public static Coordinate findShoot(String[][] boardString,int[][] boardInt, String s, int currentIndex)
	{
		for(int a=0;a<boardString.length;a++)
		{
			for(int b=0;b<boardString[a].length;b++)
			{
				if(boardString[a][b].equals(s))
				{
					//check if index is greater than currentIndex
					Coordinate temp=new Coordinate(a,b);
					int tempIndex=boardInt[temp.x][temp.y];
					if(tempIndex<currentIndex)
					{
						return new Coordinate(a,b);
					}
				}
			}
		}
		return new Coordinate(-1,-1);
	}

	public static Coordinate findLatter(String[][] boardString,int[][] boardInt, String s, int currentIndex)
	{
		for(int a=0;a<boardString.length;a++)
		{
			for(int b=0;b<boardString[a].length;b++)
			{
				if(boardString[a][b].equals(s))
				{
					//check if index is greater than currentIndex
					Coordinate temp=new Coordinate(a,b);
					int tempIndex=boardInt[temp.x][temp.y];
					if(tempIndex>currentIndex)
					{
						return new Coordinate(a,b);
					}
				}
			}
		}
		return new Coordinate(-1,-1);
	}

	public static void main(String[] args) throws FileNotFoundException
	{
		Scanner s;
        if(args.length==0)
           s = new Scanner(new File("himanshu.dat"));
        else
            s = new Scanner(new File(args[0]));

		int N = s.nextInt();
		s.nextLine();
		for ( int n = 1; n <= N; n++ )
		{
			System.out.print("Game #" + n + ": ");
			int dimension=s.nextInt();
			int winIndex=dimension*dimension-1;
			String[][] board=new String[dimension][dimension];
			int[][] boardInt=makeBoardIndex(dimension);
			for(int x=0;x<dimension;x++)
			{
				for(int y=0;y<dimension;y++)
				{
					board[x][y]=s.next();
				}
			}
			s.nextLine();
			String p1String=s.nextLine();
			String p2String=s.nextLine();
			p1String=p1String.substring(3);
			p2String=p2String.substring(3);
			s.nextLine();

			Coordinate p1Coor=new Coordinate(dimension-1,0);
			Coordinate p2Coor=new Coordinate(dimension-1,0);

			int[] p1Moves=parseMoves(p1String);
			int[] p2Moves=parseMoves(p2String);
			boolean foundWinner=false;

			for(int a=0;a<p1Moves.length;a++)
			{
				int p1TempIndex=boardInt[p1Coor.x][p1Coor.y];
				int p2TempIndex=boardInt[p2Coor.x][p2Coor.y];

				p1TempIndex+=p1Moves[a];
				p2TempIndex+=p2Moves[a];

				if(p1TempIndex>=winIndex&&p2TempIndex>=winIndex)
				{
					System.out.println("Both players win!");
					foundWinner=true;
					break;
				}
				else if(p1TempIndex>=winIndex)
				{
					System.out.println("Player 1 wins!");
					foundWinner=true;
					break;
				}
				else if(p2TempIndex>=winIndex)
				{
					System.out.println("Player 2 wins!");
					foundWinner=true;
					break;
				}

				//no one has won yet update the two players coordinates
				//might require a shoot or latter update
				p1Coor.updatePosition(getCoordinate(boardInt,p1TempIndex));
				p2Coor.updatePosition(getCoordinate(boardInt,p2TempIndex));

				//check to see if either coordinate is a latter
				if(board[p1Coor.x][p1Coor.y].indexOf("L")>=0)
				{
					Coordinate newPos=findLatter(board,boardInt,board[p1Coor.x][p1Coor.y],p1TempIndex);
					if(newPos.valid()==true)
					{
						p1Coor=newPos;
					}

				}
				if(board[p2Coor.x][p2Coor.y].indexOf("L")>=0)
				{
					Coordinate newPos=findLatter(board,boardInt,board[p2Coor.x][p2Coor.y],p2TempIndex);
					if(newPos.valid()==true)
					{
						p2Coor=newPos;
					}
				}

				//check to see if either coordinate is a shoot
				if(board[p1Coor.x][p1Coor.y].indexOf("S")>=0)
				{
					Coordinate newPos=findShoot(board,boardInt,board[p1Coor.x][p1Coor.y],p1TempIndex);
					if(newPos.valid()==true)
					{
						p1Coor=newPos;
					}

				}
				if(board[p2Coor.x][p2Coor.y].indexOf("S")>=0)
				{
					Coordinate newPos=findShoot(board,boardInt,board[p2Coor.x][p2Coor.y],p2TempIndex);
					if(newPos.valid()==true)
					{
						p2Coor=newPos;
					}
				}

			}
			if(foundWinner==false)
				System.out.println("Neither Player 1 or Player 2 won.");
			
		}
		s.close();
	}
}