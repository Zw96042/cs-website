import java.io.*;
import static java.lang.System.*;
import java.lang.*;
import java.util.*;
import java.math.*;
import java.text.*;
public class Steve {
	
	char[][] mat;
	int[][] smat;
	
	public void run() throws Exception{
		Scanner file = new Scanner(new File("steve.dat"));
		int times = file.nextInt();
		file.nextLine();
		while(times-- > 0) {
			int rr = file.nextInt(), cc = file.nextInt(), peeps = file.nextInt();
			int sr = -1, sc = -1, er = -1, ec = 0;
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
				}
			}
			solve(sr, sc, 0);
			long path = (er == -1 || smat[er][ec] == Integer.MAX_VALUE)? 0: smat[er][ec];
			ArrayList<Integer> speeds = new ArrayList<Integer>();
			while(peeps-- > 0)
				speeds.add(file.nextInt());
			file.nextLine();
			if(path == 0)
				System.out.println("Phooey");
			else
				out.println(solve2(speeds) * path);
		}
	}
	
	public void solve(int r, int c, int s) {
		if(r < 0 || c < 0 || r >= mat.length || c >= mat[0].length || mat[r][c] == '#' || smat[r][c] <= s)return;
		smat[r][c] = s++;
		solve(r + 1, c, s);
		solve(r - 1, c, s);
		solve(r, c + 1, s);
		solve(r, c - 1, s);
	}
	
    static int solve2(ArrayList<Integer> times) {
        Collections.sort(times);
        int n = times.size();
        int[] dp = new int[n + 1];
        Arrays.fill(dp, Integer.MAX_VALUE);
        dp[1] = times.get(0);
        if (n > 1) dp[2] = times.get(1);
        if (n > 2) dp[3] = times.get(0) + times.get(1) + times.get(2);
        for (int i = 4; i <= n; i++) {
            int option1 = times.get(1) + times.get(0) + times.get(i - 1) + times.get(1);
            int option2 = times.get(i - 1) + times.get(0) + times.get(i - 2) + times.get(0);
            dp[i] = Math.min(dp[i - 2] + option1, dp[i - 2] + option2);
        }
        return dp[n];
    }
	
	public static void main(String[]args)throws Exception{
		new Steve().run();
	}
}
