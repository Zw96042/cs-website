/*
 * UIL Computer Science 2024
 * Region Packet Solution
 */

import java.io.*;
import java.util.*;

public class Wesley {
	public static void main(String[]args)throws Exception{
		new Wesley().run();
	}
	
	char[][] mat;
	boolean[][][] smat;
	
	public void run()throws Exception{
		Scanner file=new Scanner(new File("wesley.dat"));
		int times=file.nextInt();
		file.nextLine();
		while(times-->0) {
			int rr = file.nextInt(), cc = file.nextInt();
			int sr = -1, sc = -1, er = -1, ec = -1;
			mat = new char[rr][cc];
			smat = new boolean[5][rr][cc];
			file.nextLine();
			for(int r = 0; r < rr; r++) {
				mat[r] = file.nextLine().trim().toCharArray();
				for(int c = 0; c < cc; c++) {
					if(mat[r][c] == 'E') {
						er = r;
						ec = c;
					}
					else if(mat[r][c] == 'S') {
						sr = r;
						sc = c;
					}
				}
			}
			if(er == -1) {
				System.out.println("Guess I won't be home in time for dinner.");
				continue;
			}
			solve(0, sr, sc);
			System.out.println(check(er, ec)? "The Great Escape.": "Guess I won't be home in time for dinner.");
		}
	}
	
	public void solve(int d, int r, int c) {
		if(r < 0 || c < 0 || r >= mat.length || c >= mat[r].length ||
				str(d).contains(""+mat[r][c]) || smat[d][r][c])return;
		smat[d][r][c] = true;
		d = (d + 1) % 5;
		solve(d, r + 1, c);
		solve(d, r - 1, c);
		solve(d, r, c + 1);
		solve(d, r, c - 1);
	}
	
	public String str(int d) {
		if(d == 0)return "#53";
		if(d == 1)return "$";
		if(d == 2)return "#15";
		if(d == 3)return ".SE";
		if(d == 4)return "#13";
		return "153#.SE";
	}
	
	public boolean check(int r, int c) {
		return smat[0][r][c] || smat[1][r][c] || smat[2][r][c] || smat[3][r][c] || smat[4][r][c];
	}
}
