/*
 * UIL Computer Science 2024
 * District Packet Solution
 */

import java.io.*;
import java.util.*;

public class Claudius {
	public static void main(String[]args)throws Exception{
		new Claudius().run();
	}
	
	int[][] smat;
	char[][] mat;
	
	public void run()throws Exception{
		Scanner file=new Scanner(new File("claudius.dat"));
		int times=file.nextInt();
		file.nextLine();
		while(times-->0) {
			int rr = file.nextInt(), cc = file.nextInt(), h = file.nextInt();
			int sr = -1, sc = -1, er = 0, ec = 0;
			file.nextLine();
			mat = new char[rr][cc];
			smat = new int[rr][cc];
			for(int r = 0; r < rr; r++) {
				mat[r] = file.nextLine().trim().toCharArray();
				Arrays.fill(smat[r], Integer.MAX_VALUE);
				for(int c = 0; c < cc; c++) {
					if(mat[r][c] == 'S') {
						sr = r;
						sc = c;
					}
					if(mat[r][c] == 'E') {
						er = r;
						ec = c;
					}
					if("RV".contains(""+mat[r][c]))
						mat[r][c] = '#';
				}
			}
			for(int r = 0; r < rr; r++) {
				for(int c = 0; c < cc; c++) {
					if(mat[r][c] == 'Q') {
						if(r - 1 >= 0 && mat[r - 1][c] == 'T')
							mat[r][c] = 'M';
						else if(r + 1 < rr && mat[r + 1][c] == 'T') 
							mat[r][c] = 'M';
						else if(c - 1 >= 0 && mat[r][c - 1] == 'T')
							mat[r][c] = 'M';
						else if(c + 1 < cc && mat[r][c + 1] == 'T')
							mat[r][c] = 'M';
						else
							mat[r][c] = '#';
					}
					if(mat[r][c] == 'A') {
						for(int ra = -1; ra <= 1; ra++)
							for(int ca = -1; ca <= 1; ca++)
								if(r + ra >= 0 && r + ra < rr && c + ca >= 0 && c + ca < cc) {
									mat[r + ra][ca + c] = '#';
									//System.out.println(r+ra);
								}
					}
					if(mat[r][c] == 'B') {
						for(int ra = -2; ra <= 2; ra++)
							for(int ca = -2; ca <= 2; ca++)
								if(r + ra >= 0 && r + ra < rr && c + ca >= 0 && c + ca < cc)
									mat[ra + r][ca + c] = '#';
					}
				}
			}
			//System.out.println(Arrays.deepToString(mat));
			solve(sr, sc, 0);
			int f = smat[er][ec] - h;
			//System.out.println(f);
			System.out.println(f <= 0? "Free at last, Free at last. " + Math.abs(f) + " hour(s) to spare."
					: "Smokey the Bear is en route.");
		}
	}
	
	public void solve(int r, int c, int s) {
		if(r < 0 || c < 0 || r >= mat.length || c >= mat[r].length || mat[r][c] == '#' || smat[r][c] <=s)return;
		smat[r][c] = s;
		int i = 1;
		if(mat[r][c] == 'T')i = 2;
		if(mat[r][c] == 'M')i = 3;
		solve(r + 1, c, s + i);
		solve(r - 1, c, s + i);
		solve(r, c + 1, s + i);
		solve(r, c - 1, s + i);
	}
}
