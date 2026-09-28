/*
 * UIL Computer Science 2024
 * Region Packet Solution
 */

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;
import java.util.ArrayList;
import java.util.HashSet;

public class Svetlana
{

    public static class Coordinate
    {
        int x;
        int y;
        public Coordinate(int paramX, int paramY)
        {
            x=paramX;
            y=paramY;
        }
    }

    public static class State
    {
        int cost;
        int[][] board;
        public State(int[][] b, int c)
        {
            cost=c;
            board=new int[b.length][b.length];
            for(int i=0;i<b.length;i++)
                board[i]=b[i].clone();
        }
        public boolean isSolved()
        {
            int size=board.length;
            int count = 1;
            for(int a=0;a<size;a++)
            {
                for(int b=0;b<size;b++)
                {
                    if(a==size-1&&b==size-1)
                        continue;
                    if(board[a][b]!=count)
                        return false;
                    count++;
                }
            }
            return true;
        } 

        public int getCost()
        {
            return cost;
        }

        public Coordinate getBlank()
        {
            int size=board.length;
            for(int a=0;a<size;a++)
            {
                for(int b=0;b<size;b++)
                {
                    if(board[a][b]==-1)
                        return new Coordinate(a,b);
                }
            }
            return new Coordinate(-1,-1);
        }

        public void printBoard()
        {
            int size=board.length;
            for(int a=0;a<size;a++)
            {
                for(int b=0;b<size;b++)
                {
                    System.out.print(board[a][b]+" ");
                }
                System.out.println();
            }
        }
    }

    public static boolean inArrayList(ArrayList<State> list,State s)
    {
        for(int a=0;a<list.size();a++)
        {
            int[][] tempBoard=list.get(a).board;
            boolean equal=true;
            for(int x=0;x<tempBoard.length;x++)
            {
                
                for(int y=0;y<tempBoard.length;y++)
                {
                    if(tempBoard[x][y]!=s.board[x][y])
                        equal=false;
                }
            }
            if(equal)
                return true;
        }
        return false;
    }

    public static String boardToString(int[][] board)
    {
        StringBuilder sb = new StringBuilder();
        for (int[] row : board) 
        {
            for (int cell : row)
            {
                sb.append(cell).append(" ");
            }
        }
        return sb.toString();
    }


    public static void main(String args[]) throws FileNotFoundException
    {
        Scanner s;
        if(args.length==0)
           s = new Scanner(new File("svetlana.dat"));
        else
            s = new Scanner(new File(args[0]));

        int N = s.nextInt();
        s.nextLine();

        for ( int n = 1; n <= N; n++ )
        {
            int dimension=3;
            s.next();
            s.nextLine();
            int[][] board=new int[dimension][dimension];
            for(int a=0;a<dimension;a++)
                for(int b=0;b<dimension;b++)
                    board[a][b]=s.nextInt();

            State start=new State(board,0);
            if(start.isSolved())
            {
                System.out.println("Number of steps needed to solve: "+start.getCost());
            }
            else
            {
                ArrayList<State> frontierList = new ArrayList<State>();
                HashSet<String> frontierSet = new HashSet<>();
                HashSet<String> visitedStates = new HashSet<>();
                frontierList.add(start);
                String tempBoardString = boardToString(start.board);
                frontierSet.add(tempBoardString);
                boolean keepGoing=true;
                while(!frontierList.isEmpty()&&keepGoing)
                {
                    State node=frontierList.remove(0);

                    Coordinate blank=node.getBlank();
                    int[] x=new int[]{-1,0, 1,0};
                    int[] y=new int[]{0,1,0,-1};
                    for(int a=0;a<x.length;a++)
                    {
                        State temp=new State(node.board,node.getCost()+1);
                        int newX=blank.x+x[a];
                        int newY=blank.y+y[a];
                        if(newX>=0&&newX<dimension&&newY>=0&&newY<dimension)
                        {
                            temp.board[blank.x][blank.y]=node.board[newX][newY];
                            temp.board[newX][newY]=-1;

                            tempBoardString = boardToString(temp.board);
                            if(!visitedStates.contains(tempBoardString)&&!frontierSet.contains(tempBoardString))
                            {
                                visitedStates.add(tempBoardString);
                                if(temp.isSolved())
                                {
                                    System.out.println("Number of steps needed to solve: "+temp.getCost());
                                    keepGoing=false;
                                    frontierList.clear();
                                }
                                else
                                {
                                    frontierList.add(temp);
                                    frontierSet.add(tempBoardString);
                                }
                            }   
                        }
                    }
                }
                if(keepGoing==true)
                    System.out.println("No solution exists.");
            }   
        }
    }
}