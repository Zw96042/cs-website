/*
 * UIL Computer Science 2024
 * Invitational A Packet Solution
 */

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

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

        public void print()
        {
            System.out.print("("+x+","+y+")");
        }
    }

    public static boolean validMove(Coordinate currentPosition,Coordinate newPosition, char[][] board, boolean print)
    {
        if(newPosition.x>=0&&newPosition.x<board.length&&newPosition.y>=0&&newPosition.y<board.length)
        {
            //proposed move is within the bound of the board

            //legal move is then constituted as having an adjacent blank space to move into (no jump)
            //OR the adjacent space is occupied by the enemy AND the adjacent diagonal along the current trajectory
            //is blank (jump)

            //Determine if the newPosition is a proposed jump or not
            boolean isJump=false;
            if(Math.abs(currentPosition.x-newPosition.x)>1&&Math.abs(currentPosition.y-newPosition.y)>1)
                isJump=true;

            if(isJump)
            {
                char turn=board[currentPosition.x][currentPosition.y];
                
                Coordinate middle=new Coordinate((currentPosition.x+newPosition.x)/2,(currentPosition.y+newPosition.y)/2);
                if(board[newPosition.x][newPosition.y]=='_'&&(board[middle.x][middle.y]!='_'&&board[middle.x][middle.y]!=Character.toLowerCase(turn)&&board[middle.x][middle.y]!=Character.toUpperCase(turn)))
                {
                    if(print)
                    {
                        currentPosition.print();
                        System.out.print("->");
                        newPosition.print();
                        System.out.println();
                    }
                    return true;
                }
                else
                    return false;
            }
            else
            {
                if(board[newPosition.x][newPosition.y]=='_')
                {
                    if(print)
                    {
                        currentPosition.print();
                        System.out.print("->");
                        newPosition.print();
                        System.out.println();
                    }
                    return true;
                }
            }
        }
        return false;
    }

    public static int count(char[][] board, int[] xMoves, int[] yMoves, Coordinate c,boolean print)
    {
        int count=0;
        for(int a=0;a<xMoves.length;a++)
        {
            Coordinate newPosition=new Coordinate(c.x+xMoves[a],c.y+yMoves[a]);
            if(validMove(c,newPosition,board,print))
                count++;
        }
        return count;
    }

    public static void main(String args[]) throws FileNotFoundException
    {
        Scanner s;
        if(args.length==0)
           s = new Scanner(new File("svetlana.dat"));
        else
            s = new Scanner(new File(args[0]));

        int N = s.nextInt();
        String temp=s.next();

        for ( int n = 1; n <= N; n++ )
        {
            temp = s.nextLine();//dashes divider
            int size=8;
            char[][] board=new char[size][size];
            for(int x=0;x<size;x++)
            {
                for(int y=0;y<size;y++)
                {
                    board[x][y]=s.next().charAt(0);
                }
            }
            if(s.hasNext())
                temp = s.next();//new line char
            int[] rMovesX={1,1,2,2};
            int[] rMovesY={-1,1,-2,2};

            int[] bMovesX={-1,-1,-2,-2};
            int[] bMovesY={-1,1,-2,2};

            int[] KingMovesX={1,1,2,2,-1,-1,-2,-2};
            int[] KingMovesY={-1,1,-2,2,-1,1,-2,2};

            int redMoves=0,blackMoves=0;
            boolean printRed=false;
            boolean printBlack=false;

            for(int x=0;x<size;x++)
            {
                for(int y=0;y<size;y++)
                {
                    char tempC=board[x][y];
                    Coordinate tempCoor=new Coordinate(x,y);
                    if(tempC=='r')
                    {
                        redMoves+=count(board,rMovesX,rMovesY,tempCoor,printRed);
                    }
                    if(tempC=='R')
                    {
                        redMoves+=count(board,KingMovesX,KingMovesY,tempCoor,printRed);
                    }
                    if(tempC=='b')
                    {
                        blackMoves+=count(board,bMovesX,bMovesY,tempCoor,printBlack);
                    }
                    if(tempC=='B')
                    {
                        blackMoves+=count(board,KingMovesX,KingMovesY,tempCoor,printBlack);
                    }
                }
            }
            System.out.println("Test case: "+n);
            System.out.println("Red valid single moves: "+redMoves);
            System.out.println("Black valid single moves: "+blackMoves);
            
        }
    }
}