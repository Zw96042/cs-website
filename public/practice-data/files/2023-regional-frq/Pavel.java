/*
 * UIL Computer Science 2023
 * Region Packet Solution
 */

import java.io.*;
import java.util.*;

public class Pavel {
	int[][][] smat;
	char[][] mat;

	public static void main(String[] args) throws Exception {
		new Pavel().run();
	}

	public void run() throws Exception {
		Scanner file = new Scanner(new File("pavel.dat"));
		int times = file.nextInt();
		file.nextLine();
		while (times-- > 0) {
			int r = file.nextInt(), c = file.nextInt(), max = file.nextInt();
			file.nextLine();
			mat = new char[r][c];
			smat = new int[4][r][c];
			int sr = -1, sc = -1, er = 0, ec = 0;
			for (int rr = 0; rr < r; rr++) {
				mat[rr] = file.nextLine().trim().toCharArray();
				Arrays.fill(smat[0][rr], Integer.MAX_VALUE);
				Arrays.fill(smat[1][rr], Integer.MAX_VALUE);
				Arrays.fill(smat[2][rr], Integer.MAX_VALUE);
				Arrays.fill(smat[3][rr], Integer.MAX_VALUE);
				for (int cc = 0; cc < c; cc++) {
					if (mat[rr][cc] == 'E') {
						er = rr;
						ec = cc;
					}
					if (mat[rr][cc] == 'S') {
						sr = rr;
						sc = cc;
					}
				}
			}
			solve(sr, sc, 0, 0);
			int end = Math.min(smat[0][er][ec], Math.min(smat[1][er][ec], Math.min(smat[2][er][ec], smat[3][er][ec])));
			System.out.println(end == Integer.MAX_VALUE ? "Aw, rats!" : end + " steps.");
			System.out.println(end <= max ? "I have had enough of these snakes." : "I'll see you in the Gulag Pavel.");
		}
	}

	public void solve(int r, int c, int s, int t) {
		if (r < 0 || c < 0 || r >= mat.length || c >= mat[r].length || mat[r][c] == '#' || smat[t][r][c] <= s
				|| (Character.isDigit(mat[r][c]) && mat[r][c] != (char) ('1' + t)))
			return;
		smat[t][r][c] = s++;
		t = (t + 1) % 4;
		solve(r + 1, c, s, t);
		solve(r - 1, c, s, t);
		solve(r, c + 1, s, t);
		solve(r, c - 1, s, t);
	}
}
