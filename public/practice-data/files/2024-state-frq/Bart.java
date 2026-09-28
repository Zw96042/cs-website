/*
 * UIL Computer Science 2024
 * State Packet Solution
 */

import java.io.*;
import java.util.*;

public class Bart {
	public static void main(String[]args)throws Exception{
		new Bart().run();
	}

	char[][] mat;
	int[][] smat;
	HashMap<int[], int[]> portals;

	public void run()throws Exception{
		Scanner file=new Scanner(new File("bart.dat"));
		int times=file.nextInt();
		file.nextLine();
		while(times-->0) {
			int rr = file.nextInt(), cc = file.nextInt();
			int sr = -1, sc = -1, er = -1, ec = -1, br = -1, bc = -1;
			portals = new HashMap<int[], int[]>();
			file.nextLine();
			mat = new char[rr][cc];
			smat = new int[rr][cc];
			for(int r = 0; r < rr; r++) {
				mat[r] = file.nextLine().trim().toCharArray();
				Arrays.fill(smat[r], Integer.MAX_VALUE);
				for(int c = 0; c < cc; c++) {
					if(mat[r][c] == '$') {
						sr = r;
						sc = c;
					}
					if(mat[r][c] == '@') {
						br = r;
						bc = c;
					}
					if(mat[r][c] == '^') {
						er = r;
						ec = c;
					}
				}
			}
			portal(rr, cc);
			fill(rr, cc, br, bc);
			//printm(rr, cc);
			solve(sr, sc, 0);
			//prints(rr, cc);
			System.out.println(smat[er][ec] == Integer.MAX_VALUE? "Tell Matthew Mcconaughey I said hi.": 
				"Exit is short for exciting. " + smat[er][ec]);
		}
	}

	public void solve(int r, int c, int s) {
		if(r < 0 || c < 0 || r >= mat.length || c >= mat[r].length || mat[r][c] == '@'
				|| mat[r][c] == '#' || smat[r][c] <= s || mat[r][c] <= s / 3 - 2)return;
		smat[r][c] = s;
		int[] port = check(r, c);
		if(port != null) 
			solve(port[0], port[1], s + port[2]);
		if(mat[r][c] <= s / 3) {
			solve(r + 1, c, s + 2);
			solve(r - 1, c, s + 2);
			solve(r, c - 1, s + 2);
			solve(r, c + 1, s + 2);
		}
		else {
			solve(r + 1, c, s + 1);
			solve(r - 1, c, s + 1);
			solve(r, c - 1, s + 1);
			solve(r, c + 1, s + 1);
		}
	}

	public void portal(int rr, int cc) {
		for(int r = 0; r < rr; r++)
			for(int c = 0; c < cc; c++)
				if(Character.isAlphabetic(mat[r][c]) && Character.isUpperCase(mat[r][c])) {
					int[] ent = new int[] {r, c};
					int[] ext = find(Character.toLowerCase(mat[r][c]));
					if(ext == null) {
						System.out.println("Something Is Wrong.");
					}
					portals.put(ent, ext);
				}
	}

	public void fill(int rr, int cc, int br, int bc) {
		for(int i = 1; i < Math.max(rr, cc) ; i++) 
			for(int j = -i; j <= i; j++) {
				if(br - i >= 0 && bc + j >= 0 && bc + j < mat[br].length)
					mat[br - i][bc + j] = 
					(!"#@".contains(""+mat[br - i][bc + j])? (char)(i - 1): '#');
				if(br + i < mat.length && bc + j >= 0 && bc + j < mat[br].length)
					mat[br + i][bc + j] = 
					(!"#@".contains(""+mat[br + i][bc + j])? (char)(i - 1): '#');
				if(bc + i < mat[br].length && br + j >= 0 && br + j < mat.length)
					mat[br + j][bc + i] =
					(!"#@".contains(""+mat[br + j][bc + i])? (char)(i - 1): '#');
				if(bc - i >= 0 && br + j >= 0 && br + j < mat.length)
					mat[br + j][bc - i] = 
					(!"#@".contains(""+mat[br + j][bc - i])? (char)(i - 1): '#');
			}
	}

	public void prints(int rr, int cc) {
		for(int r = 0; r < rr; r++) {
			String f = "";
			for(int c = 0; c < cc; c++) {
				if(smat[r][c]  < 1000)
					f += (smat[r][c]) + " ";
				else
					f += "N ";
			}
			System.out.println(f);
		}
	}

	public void printm(int rr, int cc) {
		for(int r = 0; r < rr; r++) {
			String f = "";
			for(int c = 0; c < cc; c++) {
				if(mat[r][c] < 25)
					f += (int)(mat[r][c]);
				else
					f += mat[r][c];
			}
			System.out.println(f);
		}
	}

	public int[] find(char k) {
		for(int r = 0; r < mat.length; r++)
			for(int c = 0; c < mat[r].length; c++)
				if(mat[r][c] == k) {
					//System.out.println(mat[r][c]);
					return new int[] {r, c, (int)(k - 'a' + 1)};
				}
		return null;
	}

	public int[] check(int r, int c) {
		for(int[] i:portals.keySet()) {
			if(r == i[0] && c == i[1])
				return portals.get(i);
		}
		return null;
	}
}
