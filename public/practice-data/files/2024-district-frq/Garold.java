/*
 * UIL Computer Science 2024
 * District Packet Solution
 */

import java.io.*;
import java.util.*;

public class Garold {
	
	public static void main(String[]args)throws Exception{
		new Garold().run();
	}
	
	char[][] sboard;
	char[][] boards;
	
	public void run()throws Exception{
		Scanner file=new Scanner(new File("garold.dat"));
		int times=file.nextInt();
		file.nextLine();
		while(times-->0) {
			sboard = new char[3][3];
			boards = new char[9][9];
			for(int y = 0; y < 9; y++)
				boards[y] = file.nextLine().trim().toCharArray();
			for(int y = 0; y < 3; y++) 
				for(int x = 0; x < 3; x++) 
					sboard[y][x] = bsolve(get(y * 3, x * 3));
			char c = bsolve(sboard);
			System.out.println(c == '.'? "Cat's Game.": "Player " + c + " Won.");
			for(int r = 0; r < 3; r++)
				System.out.println(sboard[r]);
		}
	}
	
	public char[][] get(int rr, int cc){
		char[][] ch = new char[3][3];
		for(int r = 0; r < 3; r++) {
			for(int c = 0; c < 3; c++)
				ch[r][c] = boards[rr + r][cc + c];
			//System.out.println(ch[r]);
		}
		//System.out.println("---");
		return ch;
	}
	
	public char bsolve(char[][]mat) {
		//check columns
		if(matches(mat[0][0], mat[1][0],mat[2][0]))
			return mat[0][0];
		if(matches(mat[0][1], mat[1][1],mat[2][1]))
			return mat[0][1];
		if(matches(mat[0][2], mat[1][2],mat[2][2]))
			return mat[0][2];
		//check rows
		if(matches(mat[0][0], mat[0][1],mat[0][2]))
			return mat[0][0];
		if(matches(mat[1][0], mat[1][1],mat[1][2]))
			return mat[1][0];
		if(matches(mat[2][0], mat[2][1],mat[2][2]))
			return mat[2][0];
		//check diagonals
		if(matches(mat[0][0], mat[1][1], mat[2][2]))
			return mat[0][0];
		if(matches(mat[2][0], mat[1][1], mat[0][2]))
			return mat[1][1];
		return '.';
	}
	
	public boolean matches(char c1, char c2, char c3) {
		return c1 == c2 && c2 == c3 && c2 != '.';
	}
}
